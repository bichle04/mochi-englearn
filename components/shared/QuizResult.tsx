import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Alert, Dimensions } from "react-native";
import { router, Stack } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";

const { width } = Dimensions.get("window");

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 180;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export interface ResultItem {
  id: number | string;
  isCorrect: boolean;
  userAns: string;
  correctAns: string;
  label?: string;
}

interface QuizResultProps {
  bandScore: string;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  results: ResultItem[];
  explanationRoute: string; // e.g. "/reading/explanation" or "/listening/explanation"
}

export default function QuizResult({
  bandScore,
  correctCount,
  totalQuestions,
  accuracy,
  results,
  explanationRoute
}: QuizResultProps) {
  const [filterType, setFilterType] = useState<"all" | "correct" | "wrong">("all");
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleFilterPress = () => {
    Alert.alert("Lọc đáp án", "Chọn trạng thái câu trả lời bạn muốn xem:", [
      { text: "Tất cả", onPress: () => setFilterType("all") },
      { text: "Chỉ hiện câu đúng", onPress: () => setFilterType("correct") },
      { text: "Chỉ hiện câu sai", onPress: () => setFilterType("wrong") },
      { text: "Huỷ", style: "cancel" }
    ]);
  };

  const filteredResults = results.filter(item => {
    if (filterType === "correct") return item.isCorrect;
    if (filterType === "wrong") return !item.isCorrect;
    return true;
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0.75],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -15],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Fixed Top Nav */}
      <View style={styles.headerNav}>
        <View style={styles.headerPlaceholder} />
        <Text style={styles.headerNavTitle}>Results</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Animated Floating Header Card */}
      <Animated.View style={[
        styles.topScoreCardContainer,
        { transform: [{ translateY: headerTranslateY }] }
      ]}>
        <Animated.View style={[
          styles.topScoreCard,
          { transform: [{ scale: headerScale }] }
        ]}>
          <Text style={styles.testCompletedTitle}>TEST COMPLETED</Text>

          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <Text style={styles.bandScoreNumber}>{bandScore}</Text>
              <Text style={styles.bandScoreLabel}>Band Score</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{correctCount}/{totalQuestions}</Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{accuracy}%</Text>
              <Text style={styles.statLabel}>ACCURACY</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>Question Review</Text>
          <TouchableOpacity onPress={handleFilterPress}>
            <SlidersHorizontal color="#545454" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: 400, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {filteredResults.map((item) => {
          const accentColor = item.isCorrect ? "#2E7D32" : "#C62828";
          return (
            <View key={item.id} style={styles.resultItem}>
              {/* C-Shape Bracket Background */}
              <View style={[styles.curveBackground, { borderColor: accentColor }]} />

              {/* Main Content inside the bracket */}
              <View style={styles.itemHeader}>
                <View style={[
                  styles.numBadge,
                  { backgroundColor: item.isCorrect ? "#F0F4EC" : "#FFF0ED" }
                ]}>
                  <Text style={[styles.numText, { color: accentColor }]}>
                    {item.id.toString().padStart(2, '0')}
                  </Text>
                </View>

                {item.label && (
                   <Text style={[styles.itemLabel, { color: accentColor }]} numberOfLines={1}>
                     {item.label}
                   </Text>
                )}

                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: explanationRoute,
                    params: {
                      qId: item.id,
                      userAns: item.userAns,
                      correctAns: item.correctAns
                    }
                  } as any)}
                >
                  <Text style={[styles.viewExplText, { color: item.isCorrect ? "#2E7D32" : "#55BA5D" }]}>
                    VIEW EXPLANATION
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.answerGrid}>
                <View style={[
                  styles.answerBox, 
                  { backgroundColor: item.isCorrect ? "#F9FAFB" : "#FFF5F5" }
                ]}>
                  <Text style={[
                    styles.ansBoxLabel, 
                    { color: item.isCorrect ? "#6B7280" : "#C62828" }
                  ]}>Your Answer</Text>
                  <Text style={styles.ansBoxValue} numberOfLines={1}>{item.userAns}</Text>
                </View>

                <View style={[styles.answerBox, { backgroundColor: "#F9FDF9" }]}>
                  <Text style={[styles.ansBoxLabel, { color: "#2E7D32" }]}>Correct Answer</Text>
                  <Text style={styles.ansBoxValue} numberOfLines={1}>{item.correctAns}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Footer sticky home button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => router.replace("/(tabs)/ielts-prep" as any)}
        >
          <Text style={styles.homeBtnText}>Trở lại trang chủ</Text>
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
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    zIndex: 20,
  },
  headerNavTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#2C2E33",
  },
  headerPlaceholder: {
    width: 44,
  },
  topScoreCardContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  topScoreCard: {
    width: '100%',
    backgroundColor: "#E8F5E9",
    borderRadius: 36,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  testCompletedTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#545454",
    letterSpacing: 2,
    marginBottom: 20,
  },
  circleOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
  },
  circleInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  bandScoreNumber: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 48,
    color: "#2C2E33",
    marginBottom: -4,
  },
  bandScoreLabel: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 11,
    color: "#858A91",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  statBlock: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#2C2E33",
  },
  statLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10,
    color: "#858A91",
    letterSpacing: 1,
    marginTop: 2,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 30,
  },
  listHeaderTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#2C2E33",
  },
  resultItem: {
    position: "relative",
    marginHorizontal: 20,
    marginBottom: 25,
    paddingLeft: 40,
    paddingVertical: 10,
  },
  curveBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    borderLeftWidth: 3,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  numBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
  },
  itemLabel: {
    flex: 1,
    marginHorizontal: 12,
    fontFamily: "WorkSans_700Bold",
    fontSize: 12,
    textTransform: "uppercase",
  },
  viewExplText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  answerGrid: {
    flexDirection: "row",
    gap: 12,
  },
  answerBox: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  ansBoxLabel: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 10,
    marginBottom: 4,
  },
  ansBoxValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#2C2E33",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    paddingTop: 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  homeBtn: {
    backgroundColor: "#4CAF50",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  homeBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
