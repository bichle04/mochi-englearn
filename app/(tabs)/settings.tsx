import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
} from "react-native";
import { 
  BellLinear, 
  LetterLinear, 
  QuestionSquareLinear, 
  DocumentTextLinear, 
  TrashBinTrashLinear 
} from "@solar-icons/react-native";
import { ChevronRight } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import HeaderWithBack from "../components/HeaderWithBack";
import { Tabs, useRouter } from "expo-router";

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [emailUpdateEnabled, setEmailUpdateEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <StatusBar barStyle="dark-content" />
      
      <HeaderWithBack 
        title="Cài đặt" 
        onBackPress={() => router.push("/(tabs)/personal")}
      />

      <View style={styles.content}>
        
        {/* Profile Card Summary */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBorder}>
            <Image
              source={user?.avatarUrl ? { uri: user.avatarUrl } : require("../../assets/images/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user?.fullName || "Người dùng"}</Text>
            <Text style={styles.profileSubtitle}>Học viên hạng Vàng</Text>
          </View>
        </View>

        {/* THÔNG BÁO Section */}
        <Text style={styles.sectionTitle}>THÔNG BÁO</Text>
        <View style={styles.sectionCard}>
          {/* Nhắc nhở học tập */}
          <View style={styles.rowItem}>
            <View style={styles.iconWrapperGreen}>
              <BellLinear size={24} color="#55BA5D" />
            </View>
            <Text style={styles.rowLabel}>Nhắc nhở học tập</Text>
            <Switch
              trackColor={{ false: "#D9DDE5", true: "#55BA5D" }}
              thumbColor="#FFFFFF"
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
            />
          </View>

          {/* Cập nhật email */}
          <View style={[styles.rowItem, styles.rowItemNoBorder]}>
            <View style={styles.iconWrapperGreen}>
              <LetterLinear size={24} color="#55BA5D" />
            </View>
            <Text style={styles.rowLabel}>Cập nhật email</Text>
            <Switch
              trackColor={{ false: "#D9DDE5", true: "#55BA5D" }}
              thumbColor="#FFFFFF"
              value={emailUpdateEnabled}
              onValueChange={setEmailUpdateEnabled}
            />
          </View>
        </View>

        {/* HỖ TRỢ Section */}
        <Text style={styles.sectionTitle}>HỖ TRỢ</Text>
        <View style={styles.sectionCard}>
          {/* Trung tâm trợ giúp */}
          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.iconWrapperGreen}>
              <QuestionSquareLinear size={24} color="#55BA5D" />
            </View>
            <Text style={styles.rowLabel}>Trung tâm trợ giúp</Text>
            <ChevronRight size={20} color="#585C61" />
          </TouchableOpacity>

          {/* Điều khoản sử dụng */}
          <TouchableOpacity style={[styles.rowItem, styles.rowItemNoBorder]} activeOpacity={0.7}>
            <View style={styles.iconWrapperGreen}>
              <DocumentTextLinear size={24} color="#55BA5D" />
            </View>
            <Text style={styles.rowLabel}>Điều khoản sử dụng</Text>
            <ChevronRight size={20} color="#585C61" />
          </TouchableOpacity>
        </View>

        {/* TÀI KHOẢN Section */}
        <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
        <View style={styles.sectionCard}>
          {/* Xóa tài khoản */}
          <TouchableOpacity style={[styles.rowItem, styles.rowItemNoBorder]} activeOpacity={0.7}>
            <View style={styles.iconWrapperRed}>
              <TrashBinTrashLinear size={24} color="#B02500" />
            </View>
            <Text style={styles.rowLabelRed}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F9",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: "#55BA5D",
    padding: 2,
    backgroundColor: "#FFFFFF",
    marginRight: 15,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 34,
    backgroundColor: "#F3F4F6",
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#2E3A59",
    marginBottom: 4,
  },
  profileSubtitle: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    color: "#585C61",
  },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#585C61",
    marginBottom: 12,
    marginLeft: 8,
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  rowItemNoBorder: {
    borderBottomWidth: 0,
  },
  iconWrapperGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  iconWrapperRed: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  rowLabel: {
    flex: 1,
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: "#2C3E50",
  },
  rowLabelRed: {
    flex: 1,
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: "#B02500",
  },
});
