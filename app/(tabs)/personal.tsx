import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import {
  UserLinear,
  ChartOutline,
  LockKeyholeLinear,
  SettingsLinear,
  PenBold
} from "@solar-icons/react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function PersonalScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await signOut();
            if (error) {
              Alert.alert("Lỗi", "Đăng xuất thất bại. Vui lòng thử lại.");
            } else {
              router.replace("/(auth)/login");
            }
          } catch (err) {
            console.error("Logout error:", err);
            Alert.alert("Lỗi", "Đã có lỗi xảy ra.");
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      title: "Thông tin cá nhân",
      description: "Cập nhật tên và ảnh của bạn",
      icon: <UserLinear size={24} color="#00BD50" />,
      onPress: () => router.push("/user"),
    },
    {
      title: "Thống kê",
      description: "Xem tiến độ học tập của bạn",
      icon: <ChartOutline size={24} color="#00BD50" />,
      onPress: () => router.push("/statistics"),
    },
    {
      title: "Thay đổi mật khẩu",
      description: "Bảo mật tài khoản của bạn",
      icon: <LockKeyholeLinear size={24} color="#00BD50" />,
      onPress: () => router.push("/(tabs)/change-pwd"),
    },
    {
      title: "Cài đặt",
      description: "Tùy chỉnh thông báo và ứng dụng",
      icon: <SettingsLinear size={24} color="#00BD50" />,
      onPress: () => router.push("/(tabs)/settings"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header - Reusing IELTS Prep style structure */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ người dùng</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card Area */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={["#4CAF50", "#8BC34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBg}
          />

          <View style={styles.profileCard}>
            {/* Avatar Section */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBorder}>
                <Image
                  source={require("../../assets/images/avatar.png")}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
                <PenBold size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Dynamic Name & Email */}
            <Text style={styles.userName}>{user?.fullName || "Người dùng"}</Text>
            <Text style={styles.userEmail}>{user?.email || "email@example.com"}</Text>

            {/* Badges Row */}
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: "#FFFAD3" }]}>
                <Text style={[styles.badgeText, { color: "#FFB339" }]}>HẠNG VÀNG</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: "#F3E5F5" }]}>
                <Text style={[styles.badgeText, { color: "#7B1FA2" }]}>CẤP ĐỘ 12</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={item.onPress}
            >
              <View style={styles.iconWrapper}>
                {item.icon}
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" strokeWidth={3} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutWrapper} activeOpacity={0.8} onPress={handleLogout}>
          <LinearGradient
            colors={["#FF5252", "#D32F2F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 28,
    color: "#2E3A59",
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    paddingHorizontal: 25,
    position: "relative",
    paddingTop: 10,
    marginBottom: 35,
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 240, // Increased height to cover roughly half of the user card
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20, // Adjusted to overlap carefully with the background
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  avatarBorder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FFFFFF",
    padding: 3,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 65,
    backgroundColor: "#F3F4F6",
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#00BD50",
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontFamily: "Lexend_700Bold", // Use 700 as it exists in RootLayout
    fontSize: 28,
    color: "#2E3A59",
    marginBottom: 6,
  },
  userEmail: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 16,
    color: "#595C5D",
    marginBottom: 22,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
  },
  badge: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  menuContainer: {
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 17,
    color: "#000000",
    marginBottom: 4,
  },
  menuDescription: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    color: "#595C5D",
  },
  logoutWrapper: {
    paddingHorizontal: 25,
  },
  logoutButton: {
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF5252",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  logoutText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
