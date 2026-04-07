import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");
import { Bell } from "lucide-react-native";
import { router } from "expo-router";
import { useUserStats } from "@/hooks/useUserStats";

export default function IELTSPrepScreen() {
  const { stats } = useUserStats();
  const currentStreak = stats?.currentStreak || 5; // Fallback to 5 as in image

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Luyện IELTS</Text>
        <View style={styles.headerRight}>
          <View style={styles.streakContainer}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{currentStreak}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={24} color="#55BA5D" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Companion Banner (Image) */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../assets/images/promotional-banner.png")}
            style={styles.promotionalBanner}
            resizeMode="stretch"
          />
        </View>

        <Text style={styles.sectionTitle}>Kỹ năng cốt lõi</Text>

        {/* Action Cards */}
        <View style={styles.cardsContainer}>
          {/* Listening */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#FFCFD1" }]}
            onPress={() => router.push("/listening" as any)}
          >
            <Image
              source={require("../../assets/images/mascot/listening_transparent.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={[styles.cardTitle, { color: "#EF3D50" }]}>Listening</Text>
          </TouchableOpacity>

          {/* Reading */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#B9E1FF" }]}
            onPress={() => router.push("/reading" as any)}
          >
            <Image
              source={require("../../assets/images/mascot/reading_transparent.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={[styles.cardTitle, { color: "#193368" }]}>Reading</Text>
          </TouchableOpacity>

          {/* Speaking */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#AAEFAE" }]}
            onPress={() => router.push("/speaking" as any)}
          >
            <Image
              source={require("../../assets/images/mascot/speaking_transparent.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={[styles.cardTitle, { color: "#1A9423" }]}>Speaking</Text>
          </TouchableOpacity>

          {/* Writing */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#C0C9EE" }]}
            onPress={() => router.push("/writing" as any)}
          >
            <Image
              source={require("../../assets/images/mascot/writing_transparent.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={[styles.cardTitle, { color: "#3F4D87" }]}>Writing</Text>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 28,
    color: "#2E3A59",
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakIcon: {
    fontSize: 20,
  },
  streakCount: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#EA580C",
  },
  notificationBtn: {
    padding: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bannerContainer: {
    marginTop: 10,
    width: "100%",
    height: 230, // Optimized aspect ratio
    borderRadius: 30,
    overflow: "hidden",
  },
  promotionalBanner: {
    width: "100%",
    height: "100%",
  },
  sectionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#000000",
    marginTop: 40,
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    height: 125,
    borderRadius: 25,
    paddingHorizontal: 15,
    overflow: "hidden",
  },
  cardImage: {
    width: 210,
    height: 210,
    marginRight: -40,
    marginLeft: -25,
    marginBottom: -20,
  },
  cardTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 32,
    flex: 1,
    textAlign: "right",
  },
});
