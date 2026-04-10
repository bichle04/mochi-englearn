import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeft, FileText, CheckCircle2, XCircle, Play } from "lucide-react-native";

import { LISTENING_EXPLANATIONS } from "../../data/mockListeningData";

export default function ListeningExplanationScreen() {
  const { qId, userAns, correctAns } = useLocalSearchParams();
  
  const idStr = (qId as string) || "4";
  const data = LISTENING_EXPLANATIONS[idStr] || LISTENING_EXPLANATIONS["4"];
  
  const formattedUserAns = (userAns as string) || "Morning check-in";
  const formattedCorrectAns = (correctAns as string) || "late check-in";
  const isCorrect = formattedUserAns.trim().toLowerCase() === formattedCorrectAns.trim().toLowerCase();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#545454" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Explanation</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Topic Badge */}
        <View style={styles.badgeWrapper}>
          <View style={styles.topicBadge}>
            <FileText size={14} color="#55BA5D" />
            <Text style={styles.topicBadgeText}>{data.topic}</Text>
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>THE QUESTION</Text>
          <Text style={styles.questionText}>{data.questionText}</Text>
        </View>

        {/* Answers Card */}
        <View style={styles.card}>
          <View style={styles.answerSection}>
             <Text style={styles.ansLabel}>YOUR ANSWER</Text>
             <View style={[styles.ansBox, { backgroundColor: isCorrect ? '#F0F9F0' : '#FEF2F2' }]}>
               {isCorrect ? (
                 <CheckCircle2 size={18} color="#55BA5D" />
               ) : (
                 <XCircle size={18} color="#EF3D50" />
               )}
               <Text style={[styles.ansText, { color: isCorrect ? '#55BA5D' : '#EF3D50' }]}>
                 {formattedUserAns}
               </Text>
             </View>
          </View>

          <View style={[styles.answerSection, { marginTop: 20 }]}>
             <Text style={styles.ansLabel}>CORRECT ANSWER</Text>
             <View style={[styles.ansBox, { backgroundColor: '#F0F9F0' }]}>
               <CheckCircle2 size={18} color="#55BA5D" />
               <Text style={[styles.ansText, { color: '#55BA5D' }]}>
                 {formattedCorrectAns}
               </Text>
             </View>
          </View>
        </View>

        {/* Transcript Card */}
        <View style={[styles.card, { borderColor: '#E6FED9', borderWidth: 1.5 }]}>
          <View style={styles.transcriptHeader}>
            <Text style={styles.transcriptLabel}>AUDIO TRANSCRIPT SNIPPET</Text>
            <View style={styles.waveIcon}>
              <View style={[styles.waveBar, { height: 12 }]} />
              <View style={[styles.waveBar, { height: 20 }]} />
              <View style={[styles.waveBar, { height: 16 }]} />
              <View style={[styles.waveBar, { height: 24 }]} />
              <View style={[styles.waveBar, { height: 14 }]} />
            </View>
          </View>

          <View style={styles.transcriptContent}>
            <Text style={styles.transcriptText}>
              "{data.transcript.split(data.highlight)[0]}
              <Text style={styles.highlightText}>{data.highlight}</Text>
              {data.transcript.split(data.highlight)[1]}"
            </Text>
          </View>

          <TouchableOpacity style={styles.listenBtn}>
            <View style={styles.playIconCircle}>
              <Play size={12} color="#FFF" fill="#FFF" />
            </View>
            <Text style={styles.listenBtnText}>Listen to this part</Text>
          </TouchableOpacity>
        </View>

        {/* Detailed Explanation */}
        <View style={styles.explanationSection}>
          <Text style={styles.explanationTitle}>Giải thích chi tiết</Text>
          <Text style={styles.explanationBody}>{data.explanation}</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#1F2937",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  badgeWrapper: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  topicBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  topicBadgeText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 10,
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F9FAFB",
  },
  cardSectionLabel: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 11,
    color: "#55BA5D",
    letterSpacing: 1,
    marginBottom: 15,
  },
  questionText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#1F2937",
    lineHeight: 26,
  },
  answerSection: {
    width: "100%",
  },
  ansLabel: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 11,
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 10,
  },
  ansBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderRadius: 20,
    paddingHorizontal: 18,
    gap: 12,
  },
  ansText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
  },
  transcriptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  transcriptLabel: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 11,
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  waveIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  waveBar: {
    width: 3,
    backgroundColor: "#E5E7EB",
    borderRadius: 1.5,
  },
  transcriptContent: {
    marginBottom: 20,
  },
  transcriptText: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 26,
    fontStyle: "italic",
  },
  highlightText: {
    fontFamily: "WorkSans_700Bold",
    backgroundColor: "#E6FED9",
    color: "#55BA5D",
  },
  listenBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#55BA5D",
    justifyContent: "center",
    alignItems: "center",
  },
  listenBtnText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: "#55BA5D",
  },
  explanationSection: {
    paddingHorizontal: 4,
    marginTop: 10,
  },
  explanationTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#1F2937",
    marginBottom: 15,
  },
  explanationBody: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 24,
    textAlign: "justify",
  },
});
