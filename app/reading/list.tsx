import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Image } from "react-native";
import { router, Stack } from "expo-router";
import { useFocusEffect } from "expo-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { MOCK_GLOBAL_STATE } from "../../data/mockReadingData";
import { useCallback, useState } from "react";

export default function PassageList() {
  const [isCompleted, setIsCompleted] = useState(false);
  
  useFocusEffect(
    useCallback(() => {
      setIsCompleted(MOCK_GLOBAL_STATE.passage1Completed);
    }, [])
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate("/reading" as any)} style={styles.backButton}>
          <ArrowLeft color="#545454" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Part 1: Social Context</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.decorativeCorner} />
          <View style={styles.badgeRow}>
            <View style={styles.academicBadge}>
              <Text style={styles.academicBadgeText}>IELTS ACADEMIC</Text>
            </View>
            <View style={styles.dot} />
            <Text style={styles.passageNumberText}>Passage 1</Text>
          </View>
          <Text style={styles.introDesc}>
            Dạng bài phổ biến: True/False/Not Given (Xác định sự thật), Note/Table/Flow-chart Completion (Điền thông tin chi tiết).
          </Text>
        </View>

        {/* Card 1 */}
        <View style={styles.card}>
          <View style={{ position: "relative" }}>
            <Image 
              source={require("../../assets/images/reading/glass.png")} 
              style={styles.cardImage} 
            />
            {isCompleted && (
              <View style={styles.completedOverlay}>
                <View style={styles.completedCircle}>
                  <CheckCircle2 color="#FFFFFF" size={40} />
                </View>
              </View>
            )}
          </View>
          <View style={styles.cardContent}>
            <View style={styles.metaRow}>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>Easy</Text>
              </View>
              <Text style={styles.wordsText}>750 words</Text>
            </View>
            
            <Text style={styles.cardTitle}>The History of Glass</Text>
            <Text style={styles.cardDesc}>
              Discover the ancient origins and modern applications of one of...
            </Text>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => router.push("/reading/detail" as any)}
            >
              <Text style={styles.startButtonText}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <Image 
            source={require("../../assets/images/reading/children.png")} 
            style={styles.cardImage} 
          />
          <View style={styles.cardContent}>
            <View style={styles.metaRow}>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>Easy</Text>
              </View>
              <Text style={styles.wordsText}>750 words</Text>
            </View>

            <Text style={styles.cardTitle}>The importance of children play</Text>
            <Text style={styles.cardDesc}>
              Brick by brick, six-year-old Alice is building a magical kingdom. Imag...
            </Text>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => router.push("/reading/detail" as any)}
            >
              <Text style={styles.startButtonText}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#193368",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    backgroundColor: "#EFFCEB", // very light green from the image
    borderBottomLeftRadius: 120,
    zIndex: 0,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    zIndex: 1,
  },
  academicBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  academicBadgeText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 10,
    color: "#4CAF50",
    letterSpacing: 0.5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 12,
  },
  passageNumberText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 13,
    color: "#545454",
  },
  introDesc: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    color: "#545454",
    lineHeight: 22,
    zIndex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20, // Add padding around the image as seen in the screenshot
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    marginBottom: 16,
  },
  cardContent: {
    paddingHorizontal: 4, // slight inset
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  difficultyBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 11,
    color: "#4CAF50",
  },
  wordsText: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 12,
    color: "#545454",
  },
  cardTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#193368",
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    color: "#545454",
    lineHeight: 22,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  startButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  completedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 16, // match padding of image
    backgroundColor: "rgba(0, 0, 0, 0.4)", // dark transparent overlay
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  completedCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
