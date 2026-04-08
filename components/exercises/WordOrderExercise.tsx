import { Exercise } from "@/types/lesson";
import { Maximize, ChevronLeft, ChevronRight, Frown, Smile } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

interface WordOrderProps {
  exercise: Exercise;
  showAnswer: boolean;
  userAnswer: string[];
  setUserAnswer: (answer: string[]) => void;
  onCheck: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const WordOrderExercise: React.FC<WordOrderProps> = ({
  exercise,
  showAnswer,
  userAnswer = [],
  setUserAnswer,
  onCheck,
  onNext,
  onPrev,
}) => {
  const [bankWords, setBankWords] = useState<string[]>([]);
  const correctAnswer = exercise.correctAnswer || "";
  const isCorrect = userAnswer.join(" ") === correctAnswer;

  useEffect(() => {
    if (exercise.options) {
      // Initialize bank words by excluding words already in userAnswer
      const allWords = [...exercise.options];
      const usedWords = [...userAnswer];
      
      // We need to keep track of counts because words might repeat
      const currentBank = [];
      const tempAnswer = [...usedWords];
      
      for (const word of allWords) {
        const index = tempAnswer.indexOf(word);
        if (index > -1) {
          tempAnswer.splice(index, 1);
        } else {
          currentBank.push(word);
        }
      }
      setBankWords(currentBank.sort(() => Math.random() - 0.5));
    }
  }, [exercise.id]);

  const handleWordPress = (word: string, index: number, isFromBank: boolean) => {
    if (showAnswer) return;

    if (isFromBank) {
      const newBank = [...bankWords];
      newBank.splice(index, 1);
      setBankWords(newBank);
      setUserAnswer([...userAnswer, word]);
    } else {
      const newAnswer = [...userAnswer];
      newAnswer.splice(index, 1);
      setUserAnswer(newAnswer);
      setBankWords([...bankWords, word]);
    }
  };

  const getChipStyle = (word: string) => {
    if (!showAnswer) {
      return {
        backgroundColor: "#D5EDFF",
        borderColor: "#0185E8",
        color: "#374151", // Constant color as requested
      };
    }
    if (isCorrect) {
      return {
        backgroundColor: "#E8FAE6",
        borderColor: "#55BA5D",
        color: "#374151", // Constant color as requested
      };
    } else {
      return {
        backgroundColor: "#FFD9DF",
        borderColor: "#FF6B81",
        color: "#374151", // Constant color as requested
      };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Maximize size={24} color="#55BA5D" />
          <Text style={styles.title}>Arrange the sentence</Text>
        </View>

        {/* Your Answer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Answer</Text>
          <View style={[
            styles.answerBox, 
            userAnswer.length === 0 && styles.answerBoxEmpty
          ]}>
            <View style={styles.answerWordsContainer}>
              {userAnswer.length === 0 ? (
                <Text style={styles.placeholderText}>Tap words below to add them here</Text>
              ) : (
                userAnswer.map((word, index) => {
                  const styles_chip = getChipStyle(word);
                  return (
                    <TouchableOpacity
                      key={`ans-${index}`}
                      style={[styles.wordChip, { backgroundColor: styles_chip.backgroundColor, borderColor: styles_chip.borderColor }]}
                      onPress={() => handleWordPress(word, index, false)}
                      disabled={showAnswer}
                    >
                      <Text style={[styles.wordText, { color: styles_chip.color }]}>{word}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
            
            {userAnswer.length > 0 && (
              <View style={styles.quoteWrapper}>
                <View style={styles.divider} />
                <Text style={styles.quoteText}>“ {userAnswer.join(" ")} ”</Text>
              </View>
            )}
          </View>
        </View>

        {/* Word Bank Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Word Bank</Text>
          <View style={styles.wordBank}>
            {bankWords.map((word, index) => (
              <TouchableOpacity
                key={`bank-${index}`}
                style={styles.bankChip}
                onPress={() => handleWordPress(word, index, true)}
                disabled={showAnswer}
              >
                <Text style={styles.bankWordText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {showAnswer ? (
          <View style={styles.feedbackContainer}>
            <View style={[styles.alertBox, isCorrect ? styles.alertCorrect : styles.alertWrong]}>
              {isCorrect ? (
                <Smile size={32} color="#55BA5D" style={styles.alertIcon} />
              ) : (
                <Frown size={32} color="#FF4040" style={styles.alertIcon} />
              )}
              <View style={styles.alertVertical}>
                <Text style={[styles.alertTitle, isCorrect ? { color: "#55BA5D" } : { color: "#FF4040" }]}>
                  {isCorrect ? "Tuyệt vời!" : "Sai rồi :("}
                </Text>
                <Text style={styles.alertSubtitle}>
                  {isCorrect ? "Bạn đã sắp xếp đúng rồi." : `Đáp án đúng: ${correctAnswer}`}
                </Text>
              </View>
            </View>

            <View style={styles.navButtonsRow}>
              <TouchableOpacity style={styles.prevButton} onPress={onPrev}>
                <ChevronLeft size={20} color="#55BA5D" />
                <Text style={styles.prevButtonText}>Trước</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <Text style={styles.nextButtonText}>{exercise.isLast ? "Hoàn thành" : "Tiếp theo"}</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.checkButton,
              userAnswer.length === (exercise.options?.length || 0) ? styles.checkButtonActive : styles.checkButtonInactive,
            ]}
            disabled={userAnswer.length !== (exercise.options?.length || 0)}
            onPress={onCheck}
          >
            <Text style={styles.checkButtonText}>Check Answer</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
    marginBottom: 40,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: 'center',
  },
  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#1E293B",
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 16,
  },
  answerBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    minHeight: 180,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    justifyContent: 'center',
  },
  answerBoxEmpty: {
    backgroundColor: "#F8FAFC",
  },
  answerWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
  },
  wordChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 6,
    borderWidth: 1.5,
  },
  wordText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 16,
  },
  quoteWrapper: {
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignSelf: 'stretch',
    marginHorizontal: -16,
    marginTop: 12,
    marginBottom: 16,
  },
  quoteText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 24,
  },
  wordBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bankChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bankWordText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 16,
    color: "#475569",
  },
  checkButton: {
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  checkButtonActive: {
    backgroundColor: "#55BA5D",
  },
  checkButtonInactive: {
    backgroundColor: "#BDC3C7",
  },
  checkButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  feedbackContainer: {
    marginTop: 8,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
  },
  alertCorrect: {
    backgroundColor: "#E8FAE6",
  },
  alertWrong: {
    backgroundColor: "#FFD9DF",
  },
  alertIcon: {
    marginRight: 16,
  },
  alertVertical: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    marginBottom: 4,
  },
  alertSubtitle: {
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    color: "#813232",
    lineHeight: 20,
  },
  navButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  prevButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#55BA5D",
    backgroundColor: "#FFFFFF",
  },
  prevButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#55BA5D",
    marginLeft: 8,
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 20,
    backgroundColor: "#55BA5D",
  },
  nextButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 8,
  },
});
