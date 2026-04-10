import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { router, Stack } from "expo-router";
import { ArrowLeft, Clock, HelpCircle, TrendingUp } from "lucide-react-native";

export default function PassageDetail() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#545454" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passage 1 Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>PASSAGE 1</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>The History of Glass</Text>
        
        {/* Info Cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <Clock color="#4CAF50" size={18} strokeWidth={2} />
            </View>
            <Text style={styles.infoLabel}>READING TIME</Text>
            <Text style={styles.infoValue}>20 mins</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <HelpCircle color="#4CAF50" size={18} strokeWidth={2} />
            </View>
            <Text style={styles.infoLabel}>QUESTIONS</Text>
            <Text style={styles.infoValue}>10 questions</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <TrendingUp color="#4CAF50" size={18} strokeWidth={2} />
            </View>
            <Text style={styles.infoLabel}>DIFFICULTY</Text>
            <Text style={styles.infoValue}>Easy</Text>
          </View>
        </View>

        {/* Question Types */}
        <View style={styles.typesSection}>
          <Text style={styles.sectionTitle}>CÁC LOẠI CÂU HỎI TRONG ĐOẠN VĂN</Text>
          
          <View style={styles.typeCard}>
            <View style={styles.typeInfo}>
              <Text style={styles.typeTitle}>True/False/Not Given</Text>
              <Text style={styles.typeDesc}>Xác định xem thông tin có phù hợp với đoạn văn hay không.</Text>
            </View>
            <View style={styles.qPill}>
              <Text style={styles.qPillText}>Q 1-7</Text>
            </View>
          </View>

          <View style={styles.typeCard}>
            <View style={styles.typeInfo}>
              <Text style={styles.typeTitle}>Note completion</Text>
              <Text style={styles.typeDesc}>Điền vào chỗ trống bằng các từ trong văn bản.</Text>
            </View>
            <View style={styles.qPill}>
              <Text style={styles.qPillText}>Q 8-10</Text>
            </View>
          </View>
        </View>
        
      </ScrollView>

      {/* Bottom Sticky Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push("/reading/test" as any)}
        >
          <Text style={styles.startButtonText}>Bắt đầu làm bài</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#2C2E33",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  badgeContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFFCEB", // Light green background from image
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#64C63E", // Brighter green dot from image
    marginRight: 6,
  },
  badgeText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 10,
    color: "#64C63E",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: "#2C2E33",
    marginBottom: 28,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "flex-start",
  },
  iconCircle: {
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 9,
    color: "#858A91",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#2C2E33",
  },
  typesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 12,
    color: "#858A91",
    letterSpacing: 1.2,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "#F7F7F7",
    borderRadius: 24,
    marginBottom: 16,
  },
  typeInfo: {
    flex: 1,
    paddingRight: 16,
  },
  typeTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#2C2E33",
    marginBottom: 8,
  },
  typeDesc: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    color: "#545454",
    lineHeight: 22,
  },
  qPill: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  qPillText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 13,
    color: "#545454",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
