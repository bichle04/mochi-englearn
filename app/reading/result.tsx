import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Alert } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import { CORRECT_MAP, MOCK_GLOBAL_STATE } from "../../data/mockReadingData";

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 180;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function Result() {
  const { userAnswers } = useLocalSearchParams();
  const navigation = useNavigation();
  const parsedAnswers = userAnswers ? JSON.parse(userAnswers as string) : {};
  const [filterType, setFilterType] = useState<"all" | "correct" | "wrong">("all");

  const resultsList = Object.keys(CORRECT_MAP).map(key => {
    const id = parseInt(key);
    const correctAns = CORRECT_MAP[id];
    const userAns = parsedAnswers[id] || "No Answer";
    const isCorrect = userAns.trim().toLowerCase() === correctAns.toLowerCase();

    return { id, isCorrect, userAns, correctAns };
  });

  const correctCount = resultsList.filter(r => r.isCorrect).length;
  const accuracy = Math.round((correctCount / 10) * 100);
  const bandScore = Math.floor((correctCount / 10) * 9 * 2) / 2; // Rough IELTS scale
  const bandScoreFmt = bandScore % 1 === 0 ? `${bandScore}.0` : bandScore.toString();

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerContainerScale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0.75],
    extrapolate: "clamp",
  });

  const headerContainerTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });

  const handleFilterPress = () => {
    Alert.alert("Lọc đáp án", "Chọn trạng thái câu trả lời bạn muốn xem:", [
      { text: "Tất cả", onPress: () => setFilterType("all") },
      { text: "Chỉ hiện câu đúng", onPress: () => setFilterType("correct") },
      { text: "Chỉ hiện câu sai", onPress: () => setFilterType("wrong") },
      { text: "Huỷ", style: "cancel" }
    ]);
  };

  const filteredResults = resultsList.filter(item => {
    if (filterType === "correct") return item.isCorrect;
    if (filterType === "wrong") return !item.isCorrect;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Fixed Top Nav */}
      <View style={styles.headerNav}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerNavTitle}>IELTS Reading</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Animated Floating Header Card with Solid Background */}
      <Animated.View style={[
        styles.topScoreCardContainer,
        {
          transform: [
            { translateY: headerContainerTranslateY }
          ]
        }
      ]}>
        <Animated.View style={[
          styles.topScoreCard,
          { transform: [{ scale: headerContainerScale }] }
        ]}>
          <Text style={styles.testCompletedTitle}>TEST COMPLETED</Text>

          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <Text style={styles.bandScoreNumber}>{bandScoreFmt}</Text>
              <Text style={styles.bandScoreLabel}>Band Score</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{correctCount}/10</Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{accuracy}%</Text>
              <Text style={styles.statLabel}>ACCURACY</Text>
            </View>
          </View>
        </Animated.View>

        {/* The filter row is inside the solid white container so it sticks cleanly */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>Question Review</Text>
          <TouchableOpacity onPress={handleFilterPress}>
            <SlidersHorizontal color="#545454" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: 380, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {filteredResults.map((item) => {
          const isCorrect = item.isCorrect;
          const accentColor = isCorrect ? "#2E7D32" : "#C62828";
          return (
            <View key={item.id} style={styles.resultItem}>
              {/* C-Shape Bracket Background */}
              <View style={[styles.curveBackground, { borderColor: accentColor }]} />

              {/* Main Content inside the bracket */}
              <View style={styles.topRow}>
                <View style={[
                  styles.numBadge,
                  { backgroundColor: isCorrect ? "#F0F4EC" : "#FFF0ED" }
                ]}>
                  <Text style={[styles.numText, { color: accentColor }]}>
                    {item.id.toString().padStart(2, "0")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: "/reading/explanation",
                    params: {
                      qId: item.id,
                      userAns: item.userAns,
                      correctAns: item.correctAns
                    }
                  } as any)}>
                  <Text style={[styles.viewExplText, { color: "#4CAF50" }]}>VIEW EXPLANATION</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.blocksRow}>
                <View style={[
                  styles.ansBlock,
                  isCorrect ? { backgroundColor: "#FAFAFA" } : { backgroundColor: "#FFF5F4" }
                ]}>
                  <Text style={[styles.ansLabel, { color: isCorrect ? "#6B7280" : "#C62828" }]}>
                    Your Answer
                  </Text>
                  <Text style={styles.ansValue} numberOfLines={1}>{item.userAns}</Text>
                </View>

                <View style={[styles.ansBlock, { backgroundColor: "#F3F8F2" }]}>
                  <Text style={[styles.ansLabel, { color: "#2E7D32" }]}>
                    Correct Answer
                  </Text>
                  <Text style={styles.ansValue} numberOfLines={1}>{item.correctAns}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => {
            MOCK_GLOBAL_STATE.passage1Completed = true; // Mark as resolved globally
            // Attempt to pop Result & Detail straight back to List cleanly without duplicating history
            const nav = navigation as any;
            if (nav.pop) {
              nav.pop(2);
            } else {
              router.replace("/reading/list" as any);
            }
          }}
        >
          <Text style={styles.returnButtonText}>Trở lại trang chủ</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  headerNavTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#2C2E33",
  },
  topScoreCardContainer: {
    position: 'absolute',
    top: 110, // Dropped safely below headerNav on all devices (including deep notches)
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 5,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  topScoreCard: {
    width: '100%',
    backgroundColor: "#E8F5E9",
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  testCompletedTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#2C2E33",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  circleOuter: {
    backgroundColor: "#FFFFFF",
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  circleInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  bandScoreNumber: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 40,
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
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
  statBlock: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#2C2E33",
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 10,
    color: "#545454",
    letterSpacing: 1,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 20,
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#2C2E33",
  },
  resultItem: {
    position: "relative",
    marginBottom: 24,
    marginHorizontal: 16,
    paddingLeft: 44, // Pushed far to the right, heavily separating it from the left crescent border
    paddingRight: 4,
    paddingTop: 12, 
    paddingBottom: 16,
  },
  curveBackground: {
    position: "absolute",
    left: 0,
    top: 4, // Offset slightly to align with the badge curve nicely
    bottom: 4,
    width: 16, // Very shallow width
    borderLeftWidth: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 40, // Large radius + thin width = extremely clean, truncated crescent curve
    borderBottomLeftRadius: 40,
    opacity: 0.9,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  numBadge: {
    width: 34,
    height: 34,
    borderRadius: 17, // Tighter circle badge like in the photo
    alignItems: "center",
    justifyContent: "center",
  },
  numText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
  },
  viewExplText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  blocksRow: {
    flexDirection: "row",
    gap: 10,
  },
  ansBlock: {
    flex: 1,
    borderRadius: 16, // Softer curves as in the photo
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ansLabel: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 11,
    marginBottom: 4,
  },
  ansValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#2C2E33",
  },
  bottomBar: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  returnButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  returnButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
