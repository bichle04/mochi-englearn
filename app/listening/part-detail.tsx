import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChevronUp, SpellCheck, ArrowRight } from "lucide-react-native";
import { 
  FileTextBold, 
  HeadphonesRoundSoundLinear 
} from "@solar-icons/react-native";
import { partDetailsMock } from "@/mocks/listening";

export default function PartDetailScreen() {
  const { id } = useLocalSearchParams();
  const data = partDetailsMock[id as string] || partDetailsMock["part1"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.partLabel}: {data.badgeName.toLowerCase().split(' ').map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Main Instruction Card */}
        <View style={styles.instructionCard}>
          {/* Background decoration */}
          <View style={styles.decorationCircle} />
          
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.badgeName}</Text>
            </View>
            <View style={styles.dot} />
            <Text style={styles.partLabel}>{data.partLabel}</Text>
          </View>

          <Text style={styles.mainTitle}>{data.mainTitle}</Text>
          
          <Text style={styles.introduction}>{data.introduction}</Text>
        </View>

        {/* Common Questions Section */}
        <Text style={styles.sectionTitle}>CÁC DẠNG CÂU HỎI THƯỜNG GẶP</Text>
        {data.commonQuestions.map((question: string, index: number) => (
          <View key={index} style={styles.questionCard}>
            <View style={styles.iconWrapperGreen}>
              <FileTextBold size={24} color="#55BA5D" />
            </View>
            <Text style={styles.questionText}>{question}</Text>
            <ChevronUp size={20} color="#000" />
          </View>
        ))}

        {/* Key Tips Section */}
        <Text style={styles.sectionTitle}>KEY TIPS</Text>
        {data.keyTips.map((tip: any, index: number) => (
          <View key={index} style={styles.tipCard}>
            <View style={[styles.iconWrapperBlue, { backgroundColor: '#D7EEFF' }]}>
              {tip.type === 'headphone' ? (
                <HeadphonesRoundSoundLinear size={24} color="#006AA1" />
              ) : (
                <SpellCheck size={24} color="#006AA1" />
              )}
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.startButton} 
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/listening/lessons", params: { id: data.partId } })}
        >
          <Text style={styles.startButtonText}>Bắt đầu khám phá</Text>
          <ArrowRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#000",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  instructionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    padding: 25,
    marginBottom: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  decorationCircle: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E6FED9",
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  badge: {
    backgroundColor: "#E6FED9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 10,
    color: "#55BA5D",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D9DDE5",
    marginHorizontal: 10,
  },
  partLabel: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: "#585C61",
  },
  mainTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 26,
    color: "#000",
    marginBottom: 15,
  },
  introduction: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "#585C61",
  },
  sectionTitle: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 14,
    color: "#585C61",
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 5,
  },
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  iconWrapperGreen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6FED9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  questionText: {
    flex: 1,
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 16,
    color: "#000",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrapperBlue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  tipText: {
    flex: 1,
    fontFamily: "WorkSans_400Regular",
    fontSize: 15,
    color: "#585C61",
    lineHeight: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  startButton: {
    backgroundColor: "#55BA5D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: "#55BA5D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  startButtonText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
