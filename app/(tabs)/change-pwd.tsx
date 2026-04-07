import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { EyeLinear, EyeClosedLinear } from "@solar-icons/react-native";
import { useAuth } from "@/contexts/AuthContext";
import HeaderWithBack from "../components/HeaderWithBack";
import { Tabs, useRouter } from "expo-router";

export default function ChangePasswordScreen() {
  const { user, signIn, updatePassword } = useAuth();
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      Alert.alert("Lỗi", "Mật khẩu phải chứa cả chữ và số");
      return;
    }

    setIsLoading(true);
    try {
      const { error: signInError } = await signIn(user?.email || "", currentPassword);
      if (signInError) {
        Alert.alert("Lỗi", "Mật khẩu hiện tại không chính xác");
        setIsLoading(false);
        return;
      }

      const { error } = await updatePassword(newPassword);
      if (error) {
        Alert.alert("Lỗi", error.message || "Cập nhật mật khẩu thất bại");
      } else {
        Alert.alert("Thành công", "Đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <StatusBar barStyle="dark-content" />
      
      <HeaderWithBack 
        title="Đổi mật khẩu" 
        onBackPress={() => router.push("/(tabs)/personal")}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Mascot Image */}
        <View style={styles.imageSection}>
          <Image
            source={require("../../assets/images/mascot/change-pwd_transparent.png")}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Form area */}
        <View style={styles.formContainer}>
          {/* Mật khẩu hiện tại */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MẬT KHẨU HIỆN TẠI</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#A0A0A0"
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                {showCurrentPassword ? (
                  <EyeLinear size={24} color="#585C61" />
                ) : (
                  <EyeClosedLinear size={24} color="#585C61" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Mật khẩu mới */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MẬT KHẨU MỚI</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#A0A0A0"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                {showNewPassword ? (
                  <EyeLinear size={24} color="#585C61" />
                ) : (
                  <EyeClosedLinear size={24} color="#585C61" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Nhập lại mật khẩu mới */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>XÁC NHẬN MẬT KHẨU</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#A0A0A0"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                {showConfirmPassword ? (
                  <EyeLinear size={24} color="#585C61" />
                ) : (
                  <EyeClosedLinear size={24} color="#585C61" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Update Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={handleChangePassword}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>{isLoading ? "Đang xử lý..." : "Cập nhật"}</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  mascotImage: {
    width: 260,
    height: 260,
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Lexend_700Bold",
    fontSize: 13,
    color: "#585C61",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF1F7",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  input: {
    flex: 1,
    fontFamily: "WorkSans_400Regular",
    fontSize: 16,
    color: "#000000",
  },
  eyeIcon: {
    padding: 5,
  },
  buttonContainer: {
    paddingHorizontal: 25,
    marginTop: "auto",
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: "#55BA5D",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#55BA5D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
