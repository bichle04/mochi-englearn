import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { router, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { PassageCard, PassageCardProps } from "../../components/reading/PassageCard";
const PAST_TESTS: Omit<PassageCardProps, "onPress">[] = [
  { id: "1", title: "Passage 1", difficulty: "Easy", time: "6-8 mins", iconBg: "#E8F5E9", iconName: "message" },
  { id: "2", title: "Passage 2", difficulty: "Medium", time: "6-8 mins", iconBg: "#FFCFD1", iconName: "user-voice" },
  { id: "3", title: "Passage 3", difficulty: "Hard", time: "6-8 mins", iconBg: "#B9E1FF", iconName: "users" },
];

export default function ReadingOverview() {
  const [activeTab, setActiveTab] = useState<"Academic" | "General">("Academic");

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate("/ielts-prep" as any)} style={styles.backButton}>
          <ArrowLeft color="#545454" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IELTS Reading</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === "Academic" && styles.tabBtnActive]}
              onPress={() => setActiveTab("Academic")}
            >
              <Text style={[styles.tabText, activeTab === "Academic" && styles.tabTextActive]}>
                IELTS Academic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === "General" && styles.tabBtnActive]}
              onPress={() => setActiveTab("General")}
            >
              <Text style={[styles.tabText, activeTab === "General" && styles.tabTextActive]}>
                IELTS General Training
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* List Title Row */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>Chọn Part</Text>
        </View>

        {/* List Cards */}
        <View>
          {PAST_TESTS.map((test) => (
            <PassageCard 
              key={test.id}
              {...test}
              onPress={() => router.push("/reading/list" as any)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
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
    backgroundColor: "#FFFFFF", // Use white context like in the image
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  tabContainer: {
    marginBottom: 24,
  },
  tabScrollContent: {
    flexDirection: "row",
    gap: 12,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabBtnActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  tabText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  listTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#193368",
  },

});
