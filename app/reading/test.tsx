import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, TextInput, Alert, BackHandler } from "react-native";
import { router, Stack } from "expo-router";
import { ArrowLeft, Clock } from "lucide-react-native";

import { QUESTIONS, PASSAGE_1_TEXT } from "../../data/mockReadingData";

export default function DoingTest() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(24 * 60 + 45); // 24:45

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k].trim() !== "").length;
  // Enable if at least 1 question is answered
  const canSubmit = answeredCount > 0;

  const handleSelect = (qId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [qId.toString()]: option }));
  };

  const handleBack = () => {
    Alert.alert("Thoát", "Bạn có chắc chắn muốn thoát không? Tiến trình làm bài sẽ không được lưu.", [
      { text: "Huỷ", style: "cancel" },
      { text: "Thoát", style: "destructive", onPress: () => router.back() }
    ]);
  };

  const handleSubmit = () => {
    Alert.alert("Nộp bài", "Bạn có chắc chắn muốn nộp bài không?", [
      { text: "Nhìn lại", style: "cancel" },
      { 
        text: "Nộp bài", 
        onPress: () => {
          router.replace({ 
            pathname: "/reading/result", 
            params: { userAnswers: JSON.stringify(answers) } 
          });
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7F9" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ArrowLeft color="#545454" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IELTS Reading</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Subheader */}
      <View style={styles.subheader}>
        <Text style={styles.progressText}>Passage 1 - {answeredCount}/{QUESTIONS.length}</Text>
        <View style={styles.timerPill}>
          <Clock color="#E8503A" size={14} strokeWidth={2.5} />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Floating Card */}
        <View style={styles.mainCard}>
          
          {/* Passage Section */}
          <Text style={styles.passageTitle}>The history of glass</Text>
          <Text style={styles.passageBody}>{PASSAGE_1_TEXT}</Text>

          <View style={styles.divider} />

          {/* Type 1 Instructions */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>Questions 1-2</Text>
            <Text style={styles.instructionText}>
              Do the following statements agree with the information given in Reading Passage 1?
              {"\n"}Write <Text style={{ fontFamily: "Nunito_800ExtraBold", color: "#4CAF50" }}>TRUE</Text>, <Text style={{ fontFamily: "Nunito_800ExtraBold", color: "#4CAF50" }}>FALSE</Text> or <Text style={{ fontFamily: "Nunito_800ExtraBold", color: "#4CAF50" }}>NOT GIVEN</Text>.
            </Text>
          </View>

          {/* Questions 1-2 */}
          <View style={styles.questionsList}>
            {QUESTIONS.slice(0, 2).map((q) => (
              <View key={q.id} style={styles.questionItem}>
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumberBox}>
                    <Text style={styles.questionNumber}>{q.id}</Text>
                  </View>
                  <Text style={styles.questionText}>{q.text}</Text>
                </View>

                {/* Options */}
                <View style={styles.optionsCol}>
                  {["TRUE", "FALSE", "NOT GIVEN"].map((opt) => {
                    const isSelected = answers[q.id.toString()] === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[
                          styles.optionBtn,
                          isSelected && styles.optionBtnActive
                        ]}
                        onPress={() => handleSelect(q.id, opt)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                        <Text style={[
                          styles.optionText,
                          isSelected && styles.optionTextActive
                        ]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Type 2 Instructions */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>Questions 3-10</Text>
            <Text style={styles.instructionText}>
              Complete the notes below.{"\n"}Choose <Text style={{ fontFamily: "Nunito_800ExtraBold" }}>ONE WORD AND/OR A NUMBER</Text> from the passage for each answer.
            </Text>
          </View>

          {/* Questions 3-10 */}
          <View style={styles.questionsList}>
            {QUESTIONS.slice(2).map((q) => (
              <View key={q.id} style={styles.questionItem}>
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumberBox}>
                    <Text style={styles.questionNumber}>{q.id}</Text>
                  </View>
                  <Text style={styles.questionText}>{q.text}</Text>
                </View>
                <TextInput 
                  style={styles.textInput}
                  placeholder="Your answer"
                  placeholderTextColor="#A1A1AA"
                  value={answers[q.id.toString()] || ""}
                  onChangeText={(text) => handleSelect(q.id, text)}
                />
              </View>
            ))}
          </View>

        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Nộp bài</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F7F9",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  subheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  progressText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 16,
    color: "#2C2E33",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  timerText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#2C2E33",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: "100%",
  },
  passageTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#2C2E33",
    textAlign: "center",
    marginBottom: 20,
  },
  passageBody: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 26,
    textAlign: "justify",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 32,
  },
  instructionCard: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  instructionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: "#4CAF50",
    marginBottom: 8,
  },
  instructionText: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 13,
    color: "#545454",
    lineHeight: 20,
  },
  questionsList: {
    gap: 32,
  },
  questionItem: {
    gap: 16,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  questionNumberBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  questionNumber: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  questionText: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#193368",
    lineHeight: 22,
  },
  optionsCol: {
    gap: 12,
    marginLeft: 38,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  optionBtnActive: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  radioCircleActive: {
    borderColor: "#4CAF50",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  optionText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 13,
    color: "#6B7280",
  },
  optionTextActive: {
    color: "#4CAF50",
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 38,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#B0B9BE",
  },
  submitButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
