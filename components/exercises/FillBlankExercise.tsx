import { Exercise } from "@/types/lesson";
import * as Speech from "expo-speech";
import { BookOpen, Volume2, Frown, Smile, ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FillBlankProps {
  exercise: Exercise;
  showAnswer: boolean;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onCheck?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const FillBlankExercise: React.FC<FillBlankProps> = ({
  exercise,
  showAnswer,
  userAnswer,
  setUserAnswer,
  onCheck,
  onNext,
  onPrev,
}) => {
  const isCorrect = userAnswer.toLowerCase().trim() === exercise.correctAnswer?.toLowerCase();
  const hasTyped = userAnswer.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <BookOpen size={20} color="#7C4DFF" />
            <Text style={styles.title}>Fill in the blank</Text>
          </View>

          <Text style={styles.sentenceText}>{exercise.blankedSentence}</Text>

          <Text style={styles.inputLabel}>Type your answer:</Text>
          <TextInput
            style={styles.textInput}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Enter the missing word..."
            placeholderTextColor="#BDC3C7"
            editable={!showAnswer}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.hintRow}>
            <View>
              <Text style={styles.hintLabel}>PRONUNCIATION HINT:</Text>
              <Text style={styles.hintText}>{exercise.ipaHint}</Text>
            </View>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => {
                const textToSpeak = exercise.word?.word || exercise.correctAnswer;
                if (textToSpeak) {
                  Speech.speak(textToSpeak, {
                    language: "en",
                  });
                }
              }}
            >
              <Volume2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {showAnswer ? (
            <View style={styles.feedbackContainer}>
              <View style={[styles.alertBox, isCorrect ? styles.alertCorrect : styles.alertWrong]}>
                {isCorrect ? (
                  <Smile size={32} color="#55BA5D" style={styles.alertIcon} />
                ) : (
                  <Frown size={32} color="#FF4040" style={styles.alertIcon} />
                )}
                <View style={styles.alertTextContent}>
                  <Text style={[styles.alertTitle, isCorrect ? { color: "#55BA5D" } : { color: "#FF4040" }]}>
                    {isCorrect ? "Tuyệt vời!" : "Sai rồi :("}
                  </Text>
                  <Text style={[styles.alertSubtitle, isCorrect ? { color: "#55BA5D" } : { color: "#FF4040" }]}>
                    {isCorrect ? "Bạn đã điền đúng rồi." : `Đáp án đúng: ${exercise.correctAnswer}`}
                  </Text>
                </View>
              </View>

              <View style={styles.navButtonsRow}>
                <TouchableOpacity style={styles.prevButton} onPress={onPrev}>
                  <ChevronLeft size={20} color="#94A3B8" />
                  <Text style={styles.prevButtonText}>Trước</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                  <Text style={styles.nextButtonText}>Tiếp theo</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.checkButton, hasTyped ? styles.checkButtonActive : styles.checkButtonInactive]}
              disabled={!hasTyped}
              onPress={onCheck}
            >
              <Text style={[styles.checkButtonText, !hasTyped && { color: "#FFFFFF" }]}>Check Answer</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    shadowColor: "#64748B", // softer shadow color instead of pure black
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 1, // lowest possible shadow on Android without disappearing
    borderWidth: 1,
    borderColor: "#F8FAFC", // super faint border
    marginBottom: 40,
    marginHorizontal: 4, // prevent shadow clipping
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#334155",
    marginLeft: 10,
  },
  sentenceText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 17,
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 40,
  },
  inputLabel: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    height: 64,
    paddingHorizontal: 20,
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    color: "#0F172A",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 40,
  },
  hintRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  hintLabel: {
    fontFamily: "Lexend_700Bold",
    fontSize: 11,
    color: "#94A3B8",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  hintText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#7C4DFF",
  },
  audioButton: {
    width: 56,
    height: 56,
    backgroundColor: "#55BA5D",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkButton: {
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  checkButtonActive: {
    backgroundColor: "#55BA5D",
  },
  checkButtonInactive: {
    backgroundColor: "#BDC3C7", // The requested gray color
  },
  checkButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  feedbackContainer: {
    marginTop: 8,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  alertWrong: {
    backgroundColor: "#FFD5D5",
  },
  alertCorrect: {
    backgroundColor: "#E8F5E9", // Not specified so use light green
  },
  alertIcon: {
    marginRight: 5,
  },
  alertTextContent: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    marginBottom: 4,
  },
  alertSubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
  },
  navButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  prevButton: {
    flex: 0.45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  prevButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#94A3B8",
    marginLeft: 4,
  },
  nextButton: {
    flex: 0.52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 20,
    backgroundColor: "#55BA5D",
  },
  nextButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 4,
  },
});
