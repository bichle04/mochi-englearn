import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { 
  ChatDotsLinear, 
  UserSpeakLinear, 
  UsersGroupRoundedLinear, 
  SquareAcademicCapLinear, 
  StopwatchLinear 
} from "@solar-icons/react-native";
import { listeningPartsMock, ListeningPart } from "@/mocks/listening";

export default function ListeningScreen() {
  const renderIcon = (part: ListeningPart) => {
    switch (part.iconName) {
      case "chat":
        return <ChatDotsLinear size={32} color="#55BA5D" />;
      case "user":
        return <UserSpeakLinear size={32} color="#E56B00" />;
      case "users":
        return <UsersGroupRoundedLinear size={32} color="#006AA1" />;
      case "academic":
        return <SquareAcademicCapLinear size={32} color="#BE2D06" />;
      default:
        return null;
    }
  };

  const getThemeProps = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return { bg: "#E6FED9", text: "#55BA5D" };
      case "Medium":
        return { bg: "#FFEBC6", text: "#E56B00" };
      case "Hard":
        return { bg: "#D7EEFF", text: "#006AA1" };
      case "Very Hard":
        return { bg: "#FEEEEA", text: "#BE2D06" };
      default:
        return { bg: "#F3F4F6", text: "#000" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IELTS Listening</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.subheader}>
        <Text style={styles.subheaderTitle}>Chọn Part</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Tất cả</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {listeningPartsMock.map((part) => {
          const theme = getThemeProps(part.difficulty);

          return (
            <View key={part.id} style={styles.card}>
              <View style={styles.cardTop}>
                {/* Icon Wrapper */}
                <View style={[styles.iconWrapper, { backgroundColor: theme.bg }]}>
                  {renderIcon(part)}
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.partTitle}>{part.title}</Text>
                    {/* Badge */}
                    <View style={[styles.badge, { backgroundColor: theme.bg }]}>
                      <Text style={[styles.badgeText, { color: theme.text }]}>{part.difficulty}</Text>
                    </View>
                  </View>
                  <Text style={styles.partDescription}>{part.description}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardBottom}>
                <View style={styles.durationContainer}>
                  <StopwatchLinear size={20} color="#585C61" />
                  <Text style={styles.durationText}>{part.duration}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.startButton} 
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: "/listening/part-detail", params: { id: part.id } })}
                >
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    padding: 5,
    marginLeft: -5,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#000000",
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  subheaderTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#000000",
  },
  viewAllText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#55BA5D",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    padding: 20,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    marginTop: 4,
  },
  partTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#000000",
    flex: 1,
    marginRight: 10,
  },
  partDescription: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 13,
    color: "#585C61",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: "#585C61",
    marginLeft: 6,
  },
  startButton: {
    backgroundColor: "#55BA5D",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
