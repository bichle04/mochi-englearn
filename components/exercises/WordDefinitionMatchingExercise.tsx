import { Exercise } from "@/types/lesson";
import * as Speech from "expo-speech";
import { Link, Volume2, Smile, X as XIcon, ChevronLeft, ChevronRight, MoveRight } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WordDefinitionMatchingProps {
  exercise: Exercise;
  showAnswer: boolean;
  matches: { [wordIndex: number]: number };
  setMatches: (m: { [wordIndex: number]: number }) => void;
  onCheck?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const MATCH_COLORS = ["#F472B6", "#55BA5D", "#0185E8", "#FF6B81"];

export const WordDefinitionMatchingExercise: React.FC<WordDefinitionMatchingProps> = ({
  exercise,
  showAnswer,
  matches,
  setMatches,
  onCheck,
  onNext,
  onPrev,
}) => {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<number | null>(null);
  
  const matchingPairs = exercise.matchingPairs || [];
  
  const [shuffledDefinitions, setShuffledDefinitions] = useState<{definition: string, originalIndex: number}[]>(() => {
    const definitions = matchingPairs.map((pair, index) => ({
      definition: pair.definition,
      originalIndex: index,
    }));
    return definitions.sort(() => Math.random() - 0.5);
  });

  if (!matchingPairs || matchingPairs.length < 4) return null;

  const handleWordPress = (wordIndex: number) => {
    if (showAnswer) return;

    if (selectedWord === wordIndex) {
      setSelectedWord(null);
      return;
    }

    let newMatches = { ...matches };
    if (newMatches[wordIndex] !== undefined) {
      delete newMatches[wordIndex];
      setMatches(newMatches);
    }

    if (selectedDefinition !== null) {
      Object.keys(newMatches).forEach((key) => {
        if (newMatches[parseInt(key)] === selectedDefinition) {
          delete newMatches[parseInt(key)];
        }
      });
      newMatches[wordIndex] = selectedDefinition;
      setMatches(newMatches);
      setSelectedWord(null);
      setSelectedDefinition(null);
    } else {
      setSelectedWord(wordIndex);
    }
  };

  const handleDefinitionPress = (defIndex: number) => {
    if (showAnswer) return;

    if (selectedDefinition === defIndex) {
      setSelectedDefinition(null);
      return;
    }

    let newMatches = { ...matches };
    const matchedWord = Object.keys(newMatches).find(
      (k) => newMatches[parseInt(k)] === defIndex
    );
    if (matchedWord !== undefined) {
      delete newMatches[parseInt(matchedWord)];
      setMatches(newMatches);
    }

    if (selectedWord !== null) {
      delete newMatches[selectedWord];
      newMatches[selectedWord] = defIndex;
      setMatches(newMatches);
      setSelectedWord(null);
      setSelectedDefinition(null);
    } else {
      setSelectedDefinition(defIndex);
    }
  };

  const getWordColor = (index: number) => {
    if (matches[index] !== undefined) {
      return MATCH_COLORS[index % MATCH_COLORS.length];
    }
    if (selectedWord === index) {
      return MATCH_COLORS[index % MATCH_COLORS.length];
    }
    return null;
  };

  const getDefColor = (index: number) => {
    const matchedWordIndex = Object.keys(matches).find(
      (wordIdx) => matches[parseInt(wordIdx)] === index
    );
    if (matchedWordIndex !== undefined) {
      return MATCH_COLORS[parseInt(matchedWordIndex) % MATCH_COLORS.length];
    }
    if (selectedDefinition === index) {
      return "#0185E8";
    }
    return null;
  };

  const checkAllCorrect = (): boolean => {
    if (Object.keys(matches).length !== matchingPairs.length) {
      return false;
    }
    return Object.keys(matches).every((wordIndexStr) => {
      const wordIndex = parseInt(wordIndexStr);
      const shuffledDefIndex = matches[wordIndex];
      const originalDefIndex = shuffledDefinitions[shuffledDefIndex].originalIndex;
      return originalDefIndex === wordIndex;
    });
  };

  const isAllCorrect = checkAllCorrect();
  const pairsMatchedCount = Object.keys(matches).length;
  const isComplete = pairsMatchedCount === matchingPairs.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Link size={20} color="#0185E8" />
          <Text style={styles.title}>Match words with definitions</Text>
        </View>

        <View style={styles.titlesRow}>
          <Text style={styles.columnTitle}>Words</Text>
          <Text style={styles.columnTitle}>Definitions</Text>
        </View>

        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            {matchingPairs.map((pair, index) => {
              const color = getWordColor(index);
              return (
                <TouchableOpacity
                  key={`w-${index}`}
                  style={[styles.box, color ? { borderColor: color, borderWidth: 2 } : {}]}
                  onPress={() => handleWordPress(index)}
                  activeOpacity={0.7}
                  disabled={showAnswer}
                >
                  <Text style={[styles.wordText, color ? { color } : {}]}>{pair.word}</Text>
                  {pair.pronunciation && (
                    <Text style={[styles.pronText, color ? { color } : {}]}>{pair.pronunciation}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => Speech.speak(pair.word, { language: "en" })}
                    style={{ marginTop: 6 }}
                  >
                    <Volume2 size={16} color={color || "#94A3B8"} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ width: 14 }} />
          <View style={styles.column}>
            {shuffledDefinitions.map((item, index) => {
              const color = getDefColor(index);
              return (
                <TouchableOpacity
                  key={`d-${index}`}
                  style={[styles.box, color ? { borderColor: color, borderWidth: 2 } : {}]}
                  onPress={() => handleDefinitionPress(index)}
                  activeOpacity={0.7}
                  disabled={showAnswer}
                >
                  <Text style={[styles.defText, color ? { color } : {}]}>{item.definition}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.matchedCount}>
          Matched: {pairsMatchedCount} / {matchingPairs.length}
        </Text>

        {showAnswer ? (
          <View style={styles.feedbackContainer}>
            {isAllCorrect ? (
              <View style={styles.alertBoxCorrect}>
                <View style={styles.alertHeaderRow}>
                  <Smile size={28} color="#55BA5D" style={{ marginRight: 6 }} />
                  <Text style={styles.alertTitleCorrect}>Tuyệt vời!</Text>
                </View>
                <Text style={[styles.alertSubtitle, { color: "#55BA5D", textAlign: "center" }]}>
                  Bạn đã nối đúng toàn bộ
                </Text>
              </View>
            ) : (
              <View style={styles.alertBoxWrong}>
                <View style={styles.alertHeaderRow}>
                  <XIcon size={24} color="#E53935" strokeWidth={4} style={{  marginTop: 1 }} />
                  <Text style={styles.alertTitleWrong}>Có một vài câu bạn nối chưa đúng</Text>
                </View>
                <Text style={styles.alertSubtitle}>Đáp án đúng</Text>
                
                <View style={styles.correctionTable}>
                  {matchingPairs.map((pair, index) => (
                    <View key={index} style={styles.correctionRow}>
                      <Text style={styles.correctionWord}>{pair.word}</Text>
                      <View style={styles.correctionArrowContainer}>
                        <MoveRight size={18} color="#1E293B" strokeWidth={3} />
                      </View>
                      <Text style={styles.correctionDef}>{pair.definition}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.navButtonsRow}>
              <TouchableOpacity style={styles.prevButton} onPress={onPrev}>
                <ChevronLeft size={20} color="#55BA5D" />
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
            style={[styles.checkButton, isComplete ? styles.checkButtonActive : styles.checkButtonInactive]}
            disabled={!isComplete}
            onPress={onCheck}
          >
            <Text style={[styles.checkButtonText, !isComplete && { color: "#FFFFFF" }]}>Check Answer</Text>
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
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F8FAFC",
    marginBottom: 60,
    marginHorizontal: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#1E293B",
    marginLeft: 8,
  },
  titlesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  columnTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1E293B",
  },
  columnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  column: {
    flex: 1,
  },
  box: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    minHeight: 110,
  },
  wordText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1E293B",
    textAlign: "center",
  },
  pronText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
    textAlign: "center",
  },
  defText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 12,
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 16,
  },
  matchedCount: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
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
    backgroundColor: "#BDC3C7",
  },
  checkButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  feedbackContainer: {
    marginTop: 8,
  },
  alertBoxWrong: {
    backgroundColor: "#FCE4E4",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  alertBoxCorrect: {
    backgroundColor: "#D5FFD9",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  alertHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  alertTitleWrong: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
    flexShrink: 1,
  },
  alertTitleCorrect: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#55BA5D",
    textAlign: "center",
  },
  alertSubtitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  correctionTable: {
    width: "100%",
    alignItems: "center",
  },
  correctionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
  },
  correctionWord: {
    width: "38%",
    textAlign: "right",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: "#813232",
    lineHeight: 20,
  },
  correctionArrowContainer: {
    width: 32,
    alignItems: "center",
    paddingTop: 1,
  },
  correctionDef: {
    width: "48%",
    textAlign: "left",
    fontFamily: "Lexend_600SemiBold",
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
    flex: 0.45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#55BA5D",
    backgroundColor: "#FFFFFF",
  },
  prevButtonText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#55BA5D",
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