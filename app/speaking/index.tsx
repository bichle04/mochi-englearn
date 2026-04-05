import React from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import {
  HeadphonesRoundBold,
  CupBold,
  HistoryBold,
  Chart2Bold,
} from "@solar-icons/react-native";

const { width } = Dimensions.get("window");

export default function SpeakingModeSelection() {
  const handleModeSelect = (mode: "practice" | "test") => {
    if (mode === "practice") {
      router.push("/speaking/practice" as any);
    } else {
      router.push("/speaking/test" as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Close button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Chọn chế độ làm bài</Text>
          <Text style={styles.subtitle}>
            Lựa chọn chế độ phù hợp với bạn
          </Text>
        </View>

        {/* Main Mode Cards */}
        <View style={styles.modeCardsRow}>
          {/* Practice Mode */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleModeSelect("practice")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#FFFAE6" }]}>
              <HeadphonesRoundBold size={40} color="#FFA600" />
            </View>
            <Text style={styles.cardTitle}>Luyện tập</Text>
            <Text style={styles.cardDescription}>
              Ôn luyện để{"\n"}chinh phục{"\n"}Speaking
            </Text>
          </TouchableOpacity>

          {/* Test Mode */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleModeSelect("test")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#E8F7FE" }]}>
              <CupBold size={40} color="#109EFA" />
            </View>
            <Text style={styles.cardTitle}>Phòng thi</Text>
            <Text style={styles.cardDescription}>
              Thi thử trong{"\n"}phòng thi ảo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/speaking/history")}
            activeOpacity={0.8}
          >
            <HistoryBold size={24} color="#58CC02" />
            <Text style={styles.actionText}>Lịch sử</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/speaking/stats")}
            activeOpacity={0.8}
          >
            <Chart2Bold size={24} color="#109EFA" />
            <Text style={styles.actionText}>Thống kê</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  closeText: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "300",
    marginTop: -2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 32,
    color: "#2E3A59",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 18,
    color: "#8F9BB3",
    textAlign: "center",
  },
  modeCardsRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    padding: 24,
    alignItems: "center",
    width: (width - 64) / 2,
    minHeight: 250,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
    color: "#1A2138",
    marginBottom: 10,
    textAlign: "center",
  },
  cardDescription: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: "#8F9BB3",
    textAlign: "center",
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F5",
  },
  actionText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#2E3A59",
  },
});
