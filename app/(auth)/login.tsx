import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        let errorMessage = "Đăng nhập thất bại";

        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email hoặc mật khẩu không chính xác";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Vui lòng xác thực email trước khi đăng nhập";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau";
        }

        Alert.alert("Lỗi", errorMessage);
      } else {
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error("Login error:", err);
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
          bounces={false}
        >
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>để tiếp tục vươn tới mục tiêu!</Text>

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

          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => router.push("./forgot-password")}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>hoặc tiếp tục với</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <GoogleIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FacebookIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("./register")}>
              <Text style={styles.signupLink}>Đăng ký ngay!</Text>
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
    paddingTop: 32,
    paddingBottom: 24,
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
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: "WorkSans_700Bold",
    color: "#7F8C8D",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: "WorkSans_700Bold",
    color: "#FFFFFF",
  },
  orText: {
    textAlign: "center",
    fontFamily: "WorkSans_400Regular",
    color: "#7F8C8D",
    fontSize: 14,
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  socialButton: {
    width: 54,
    height: 54,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signupText: {
    fontSize: 15,
    fontFamily: "WorkSans_400Regular",
    color: "#5C6B73",
  },
  signupLink: {
    fontSize: 15,
    fontFamily: "WorkSans_700Bold",
    color: "#4CAF50",
  },
});

