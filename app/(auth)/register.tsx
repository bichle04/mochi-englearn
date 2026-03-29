import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Eye, EyeOff, Check } from "lucide-react-native";
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
import Svg, { Path } from "react-native-svg";

const GoogleIcon = () => (
  <Svg width="26" height="26" viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </Svg>
);

const FacebookIcon = () => (
  <Svg width="26" height="26" viewBox="0 0 256 256">
    <Path fill="#1877F2" d="M256,128C256,57.308,198.692,0,128,0C57.308,0,0,57.308,0,128c0,63.888,46.808,116.843,108,126.445V165H75.5v-37H108V99.8c0-32.08,19.11-49.8,48.348-49.8C170.352,50,185,52.5,185,52.5v33.5h-16.15c-15.328,0-20.85,9.504-20.85,20.024V128h35.5l-5.675,37H148v89.445c61.192-9.602,108-62.556,108-126.445"/>
    <Path fill="#FFFFFF" d="M177.825,165L183.5,128H148v-24.176C148,93.304,153.522,83.8,168.85,83.8H185V50.3c0,0-14.648-2.5-28.652-2.5C127.11,47.8,108,65.52,108,97.6V128H75.5v37H108v89.445C114.56,255.46,121.148,256,128,256z"/>
  </Svg>
);

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (!agreed) {
      Alert.alert("Lỗi", "Vui lòng đồng ý với chính sách bảo mật");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        let errorMessage = "Đăng ký thất bại";

        if (error.message.includes("User already registered")) {
          errorMessage = "Email đã được sử dụng";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "Mật khẩu phải có ít nhất 6 ký tự";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Email không hợp lệ";
        }

        Alert.alert("Lỗi đăng ký", errorMessage);
      } else {
        Alert.alert(
          "Đăng ký thành công! 🎉",
          "Vui lòng kiểm tra email để xác thực tài khoản.",
          [
            {
              text: "OK",
              onPress: () => router.push("./login"),
            },
          ]
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
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
        <View style={styles.headerRow}>
          <Image
            source={require("../../assets/images/mascot/mochi_transparent.png")}
            style={styles.mascotSmall}
            resizeMode="contain"
          />
          <Text style={styles.appNameSmall}>
            MOCHI
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, zIndex: 2 }}
      >
        <View style={styles.bottomSection}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>và bắt đầu học tập ngay hôm nay!</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                placeholderTextColor="#95A5A6"
                value={fullName}
                onChangeText={setFullName}
                editable={!isLoading}
              />
            </View>

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

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Mật khẩu"
                placeholderTextColor="#95A5A6"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                {showPassword ? (
                  <Eye size={20} color="#7F8C8D" />
                ) : (
                  <EyeOff size={20} color="#7F8C8D" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#95A5A6"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIconContainer}
              >
                {showConfirmPassword ? (
                  <Eye size={20} color="#7F8C8D" />
                ) : (
                  <EyeOff size={20} color="#7F8C8D" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.socialRow}>
              <Text style={styles.socialLabel}>Liên kết tài khoản</Text>
              <View style={styles.socialIconsWrapper}>
                <TouchableOpacity style={styles.socialButton}>
                  <GoogleIcon />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FacebookIcon />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxText}>
                Tôi đã đọc và đồng ý với <Text style={styles.policyLink}>Chính sách bảo mật</Text> của ứng dụng.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.registerButton, 
                (!agreed || isLoading) && styles.disabledButton
              ]}
              onPress={handleRegister}
              disabled={isLoading || !agreed}
            >
              <Text style={[
                styles.registerButtonText,
                (!agreed || isLoading) && styles.disabledButtonText
              ]}>
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
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
    height: "23%", 
    backgroundColor: "#4CAF50",
    justifyContent: "flex-end", 
    alignItems: "center",
    paddingBottom: 35, 
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16, 
  },
  mascotSmall: {
    width: 85,   
    height: 85,
  },
  appNameSmall: {
    fontSize: 32,  
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
    paddingBottom: 32,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "WorkSans_700Bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "WorkSans_400Regular",
    color: "#5C6B73",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 25,
    paddingHorizontal: 20,
    minHeight: 52,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "WorkSans_400Regular",
    color: "#2C3E50",
  },
  eyeIconContainer: {
    padding: 8,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 8,
  },
  socialLabel: {
    fontSize: 15,
    fontFamily: "WorkSans_400Regular",
    color: "#5C6B73",
  },
  socialIconsWrapper: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingRight: 20, 
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#7F8C8D",
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkboxText: {
    flex: 1, 
    fontSize: 14,
    fontFamily: "WorkSans_400Regular",
    color: "#5C6B73",
    lineHeight: 20,
  },
  policyLink: {
    fontFamily: "WorkSans_700Bold",
    color: "#4CAF50",
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 1,
    backgroundColor: "#CDCCD1",
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: "WorkSans_700Bold",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#696674",
  },
  loginContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  loginLink: {
    fontSize: 15,
    fontFamily: "WorkSans_700Bold",
    color: "#696674",
  },
});
