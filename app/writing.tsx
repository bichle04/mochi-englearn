import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, PenTool, Sparkles, Clock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";

export default function WritingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#0F172A" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IELTS Writing</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <LinearGradient
            colors={["#F0FDF4", "#DCFCE7"]}
            style={styles.iconBg}
          >
            <PenTool size={60} color="#55BA5D" strokeWidth={1.5} />
            <View style={styles.sparkle1}>
              <Sparkles size={20} color="#FFB339" fill="#FFB339" />
            </View>
            <View style={styles.sparkle2}>
              <Clock size={18} color="#94A3B8" />
            </View>
          </LinearGradient>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>Đang hoàn thiện</Text>
          <Text style={styles.description}>
            Chúng mình đang nỗ lực phát triển tính năng {"\n"}
            <Text style={styles.highlight}>Luyện viết AI Chấm điểm</Text> để mang lại {"\n"}
            trải nghiệm tốt nhất cho bạn.
          </Text>
        </View>

        {/* Feature List */}
        <View style={styles.featurePreview}>
          <View style={styles.featureItem}>
            <View style={styles.dot} />
            <Text style={styles.featureText}>Chấm điểm AI chuẩn xác</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.dot} />
            <Text style={styles.featureText}>Sửa lỗi ngữ pháp chi tiết</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.dot} />
            <Text style={styles.featureText}>Kho đề thi đa dạng</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.back()}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#55BA5D", "#45A04D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Quay lại trang chủ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { 
    fontSize: 18, 
    fontFamily: "Lexend_700Bold",
    color: "#0F172A",
  },
  content: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: 30,
  },
  illustrationContainer: {
    marginBottom: 40,
    position: 'relative',
  },
  iconBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#55BA5D",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  sparkle1: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  sparkle2: {
    position: "absolute",
    bottom: 20,
    left: 10,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  mainTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 28,
    color: "#0F172A",
    marginBottom: 12,
  },
  description: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
  highlight: {
    fontFamily: "Lexend_600SemiBold",
    color: "#55BA5D",
  },
  featurePreview: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#55BA5D",
    marginRight: 12,
  },
  featureText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    color: "#334155",
  },
  actionButton: {
    width: "100%",
    shadowColor: "#55BA5D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  }
});
