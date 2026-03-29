import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        let errorMessage = "Không thể gửi email đặt lại mật khẩu";

        if (error.message.includes("User not found")) {
          errorMessage = "Email không tồn tại trong hệ thống";
        }

        Alert.alert("Lỗi", errorMessage);
      } else {
        Alert.alert(
          "Thành công! 📧",
          "Vui lòng kiểm tra email để đặt lại mật khẩu.",
          [
            {
              text: "OK",
              onPress: () => router.push("/(auth)/login"),
            },
          ]
        );
      }
    } catch (err) {
      console.error("Reset password error:", err);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/images/mascot/mochi_transparent.png")}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.appName}>
          MOCHI
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, zIndex: 2 }}
      >
        <View style={styles.bottomSection}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Quên mật khẩu</Text>
            <Text style={styles.subtitle}>
              Nhập email của bạn để đặt lại mật khẩu
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#95A5A6"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.disabledButton]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? "Đang xử lý..." : "Gửi liên kết"}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.loginLink}>Quay lại Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    height: "35%",
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  mascot: {
    width: 125,
    height: 125,
    marginBottom: 4,
  },
  appName: {
    fontSize: 34,
    fontFamily: "Nunito_900Black",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontFamily: "WorkSans_700Bold",
    color: "#3B3A4F",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "WorkSans_400Regular",
    color: "#5C6B73",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 25,
    paddingHorizontal: 20,
    minHeight: 52,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "WorkSans_400Regular",
    color: "#2C3E50",
  },
  resetButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: "WorkSans_700Bold",
    color: "#FFFFFF",
  },
  loginContainer: {
    alignItems: "center",
  },
  loginLink: {
    fontSize: 15,
    fontFamily: "WorkSans_700Bold",
    color: "#4CAF50",
  },
});
