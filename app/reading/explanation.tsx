import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeft, BookOpen, FileText } from "lucide-react-native";

import { EXPLANATIONS } from "../../data/mockReadingData";

export default function Explanation() {
  const { qId, userAns, correctAns } = useLocalSearchParams();
  
  const idStr = (qId as string) || "1";
  const content = EXPLANATIONS[idStr] || EXPLANATIONS["1"];
  
  const formattedUserAns = (userAns as string) || "NOT SELECTED";
  const formattedCorrectAns = (correctAns as string) || "NOT GIVEN";
  
  const isCorrect = formattedUserAns.trim().toLowerCase() === formattedCorrectAns.trim().toLowerCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#545454" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Explanation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Academic Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.academicBadge}>
            <FileText color="#4CAF50" size={12} strokeWidth={2.5} />
            <Text style={styles.academicBadgeText}>IELTS ACADEMIC</Text>
          </View>
        </View>

        {/* Card 1: Question details */}
        <View style={styles.card}>
          <Text style={styles.passageSubtitle}>READING PASSAGE 1</Text>
          <Text style={styles.passageTitle}>The History of Glass</Text>
          
          <Text style={styles.questionLabel}>Question {idStr}:</Text>
          <Text style={styles.questionText}>"{content.questionText}"</Text>

          {/* User Answer Row (New addition based on request) */}
          <View style={styles.answerRowBase}>
            <View style={styles.labelContainer}>
              <Text style={[styles.labelText, { color: isCorrect ? '#4CAF50' : '#E8503A' }]}>YOUR ANSWER</Text>
              <View style={[styles.labelUnderline, { backgroundColor: isCorrect ? '#4CAF50' : '#E8503A' }]} />
            </View>
            <View style={[styles.pill, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFF0ED' }]}>
              <Text style={[styles.pillText, { color: isCorrect ? '#2E7D32' : '#C62828' }]}>{formattedUserAns}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Correct Answer Row */}
          <View style={styles.answerRowBase}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>CORRECT ANSWER</Text>
              <View style={styles.labelUnderline} />
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{formattedCorrectAns}</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Passage Evidence */}
        <View style={styles.card}>
          <View style={styles.evidenceHeaderRow}>
            <BookOpen color="#4CAF50" size={20} />
            <Text style={styles.evidenceTitle}>Passage Evidence</Text>
          </View>

          <View style={styles.evidenceBox}>
            <Text style={styles.evidenceText}>
              "{content.evidenceLead}
              <Text style={styles.highlightText}>{content.highlightText}</Text>
              {content.evidenceTail}"
            </Text>
          </View>
          
          <Text style={styles.evidenceSource}>{content.source}</Text>
        </View>

        {/* Detailed Explanation */}
        <View style={styles.explanationSection}>
          <Text style={styles.explanationTitle}>Giải thích chi tiết</Text>
          <Text style={styles.explanationBody}>{content.explanationText}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
  },
  backBtn: {
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
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  badgeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  academicBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F1",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  academicBadgeText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#545454",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  passageSubtitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#858A91",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  passageTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#2C2E33",
    marginBottom: 20,
  },
  questionLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: "#545454",
    marginBottom: 8,
  },
  questionText: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 15,
    color: "#2C2E33",
    lineHeight: 24,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  answerRowBase: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 16,
  },
  labelContainer: {
    alignItems: "center",
  },
  labelText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10,
    color: "#4CAF50",
    letterSpacing: 0.5,
  },
  labelUnderline: {
    height: 2,
    width: "100%",
    backgroundColor: "#4CAF50",
    marginTop: 2,
  },
  pill: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: 160,
  },
  pillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#2E7D32", 
  },
  evidenceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  evidenceTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#2C2E33",
  },
  evidenceBox: {
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  evidenceText: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 14,
    color: "#545454",
    lineHeight: 24,
  },
  highlightText: {
    fontFamily: "WorkSans_600SemiBold",
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  evidenceSource: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 11,
    color: "#858A91",
    textAlign: "right",
  },
  explanationSection: {
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  explanationTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#2C2E33",
    marginBottom: 16,
  },
  explanationBody: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    color: "#545454",
    lineHeight: 24,
    textAlign: "justify",
  },
});
