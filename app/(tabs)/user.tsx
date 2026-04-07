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
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Tabs, useRouter } from "expo-router";
import { ShieldCheckLinear, CheckCircleBold, LockKeyholeLinear, PenBold } from "@solar-icons/react-native";
import { useAuth } from "@/contexts/AuthContext";
import HeaderWithBack from "../components/HeaderWithBack";

export default function UserScreen() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("Lỗi", "Họ và tên không được để trống");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await updateProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUri,
      });

      if (error) {
        Alert.alert("Lỗi", "Cập nhật thất bại. Vui lòng thử lại.");
      } else {
        Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Cấp quyền", "Vui lòng cấp quyền truy cập thư viện ảnh để đổi ảnh đại diện.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <StatusBar barStyle="dark-content" />
      
      <HeaderWithBack 
        title="Thông tin cá nhân" 
        onBackPress={() => router.push("/(tabs)/personal")}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Background & Avatar Area */}
        <View style={styles.topSection}>
          <LinearGradient
            colors={["#4CAF50", "#8BC34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBg}
          />

          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image
                source={avatarUri ? { uri: avatarUri } : require("../../assets/images/avatar.png")}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity style={styles.editButton} onPress={pickImage} activeOpacity={0.8}>
               <PenBold size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Area */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>HỌ VÀ TÊN</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={user?.email || ""}
                editable={false}
              />
              <LockKeyholeLinear size={20} color="#585C61" />
            </View>
            <Text style={styles.helpText}>
              Email không thể thay đổi để bảo mật tài khoản.
            </Text>
          </View>

          {/* Verified Account Banner */}
          <View style={styles.verifiedBanner}>
            <ShieldCheckLinear size={24} color="#55BA5D" />
            <Text style={styles.verifiedText}>Tài khoản đã xác thực</Text>
            <CheckCircleBold size={24} color="#55BA5D" />
          </View>

        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={handleSaveProfile}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>{isLoading ? "Đang lưu..." : "Lưu"}</Text>
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
  topSection: {
    alignItems: "center",
    marginBottom: 35,
    position: 'relative',
    paddingBottom: 40, // Cân bằng với marginTop phía trên để căn giữa avatar (40 + 156 + 40 = 236)
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 236, // Chiều cao chính xác để top và bottom bằng nhau
  },
  avatarWrapper: {
    position: "relative",
    marginTop: 40, // Pushes avatar down to sit cleanly inside the green gradient
  },
  avatarBorder: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: "#FFFFFF",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 78,
    backgroundColor: "#F3F4F6",
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#55BA5D",
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
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
  inputDisabled: {
    color: "#585C61",
  },
  helpText: {
    fontSize: 12, // Usually uses the global font or standard text here 
    color: "#585C61",
    marginTop: 8,
    marginLeft: 4,
  },
  verifiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1FFE4",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 10,
    marginBottom: 30,
  },
  verifiedText: {
    flex: 1,
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: "#000000",
    marginLeft: 14,
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