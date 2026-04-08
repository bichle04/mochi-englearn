import { Exercise } from "@/types/lesson";
import * as Speech from "expo-speech";
import { CircleDot, Volume2, ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";

interface MultipleChoiceProps {
  exercise: Exercise;
  showAnswer: boolean;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  onCheck?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceProps> = ({
  exercise,
  showAnswer,
  selectedOption,
  setSelectedOption,
  onCheck,
  onNext,
  onPrev,
}) => {
  const isCorrect = selectedOption === exercise.correctAnswer;
  const hasSelected = !!selectedOption;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <CircleDot size={20} color="#55BA5D" />
          <Text style={styles.title}>Choose the correct definition</Text>
        </View>

        <View style={styles.wordSection}>
          <Text style={styles.questionWord}>{exercise.word.word}</Text>
          <Text style={styles.pronunciation}>{exercise.word.pronunciation}</Text>
          
          <TouchableOpacity
            style={styles.audioButton}
            onPress={() => {
              Speech.speak(exercise.word.word, {
                language: "en",
              });
            }}
          >
            <Volume2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          {exercise.options?.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === exercise.correctAnswer;
            
            let containerStyle: any = styles.optionButton;
            let textStyle = styles.optionText;

            if (showAnswer) {
              if (isCorrectOption) {
                containerStyle = [styles.optionButton, styles.optionCorrect];
              } else if (isSelected && !isCorrect) {
                containerStyle = [styles.optionButton, styles.optionWrong];
              }
            } else if (isSelected) {
              containerStyle = [styles.optionButton, styles.optionSelected];
            }

            return (
              <TouchableOpacity
                key={index}
                style={containerStyle}
                onPress={() => !showAnswer && setSelectedOption(option)}
                disabled={showAnswer}
                activeOpacity={0.7}
              >
                <Text style={textStyle}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showAnswer ? (
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
        ) : (
          <TouchableOpacity
            style={[styles.checkButton, hasSelected ? styles.checkButtonActive : styles.checkButtonInactive]}
            disabled={!hasSelected}
            onPress={onCheck}
          >
            <Text style={[styles.checkButtonText, !hasSelected && { color: "#FFFFFF" }]}>Check Answer</Text>
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
    justifyContent: "center",
  },
  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1E293B",
    marginLeft: 8,
  },
  wordSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  questionWord: {
    fontFamily: "Lexend_700Bold",
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 8,
  },
  pronunciation: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#94A3B8",
    marginBottom: 20,
  },
  audioButton: {
    width: 48,
    height: 48,
    backgroundColor: "#55BA5D",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "transparent", // Use 1.5px border to mirror selected state thickness
  },
  optionSelected: {
    backgroundColor: "#D5EDFF",
    borderColor: "#0185E8",
  },
  optionCorrect: {
    backgroundColor: "#E8FAE6",
    borderColor: "#55BA5D",
  },
  optionWrong: {
    backgroundColor: "#FFD9DF",
    borderColor: "#FF6B81",
  },
  optionText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
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
