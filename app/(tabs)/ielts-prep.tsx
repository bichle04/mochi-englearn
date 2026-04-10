import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");
import MainHeader from "@/components/shared/MainHeader";
import { router } from "expo-router";

export default function IELTSPrepScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <MainHeader title="Luyện IELTS" />


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
