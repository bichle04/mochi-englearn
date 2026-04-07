import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Flame, Bell } from "lucide-react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  StatusBar
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useUserStats } from "../../hooks/useUserStats";

export default function HomeScreen() {
  const { user } = useAuth();
  const { stats, weeklyProgress } = useUserStats();
  // We use currentStreak from user stats if available, else static default
  const currentStreak = user ? stats?.currentStreak || 0 : 0;

  const displayName = user?.fullName ||
    user?.email?.split('@')[0] ||
    "Ngọc";

  const renderStreakDays = () => {
    const daysArr = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const localDay = new Date().getDay();
    const currentDayIndex = localDay === 0 ? 6 : localDay - 1;

    return (
      <View style={styles.streakDaysRow}>
        {daysArr.map((dayName, index) => {
          const isCurrentDay = index === currentDayIndex;
          let isFire = false;

          const dayNameToEnglish: Record<string, string> = {
            "T2": "Mon", "T3": "Tue", "T4": "Wed", "T5": "Thu", "T6": "Fri", "T7": "Sat", "CN": "Sun"
          };

          // Check weekly progress data
          if (weeklyProgress && weeklyProgress.length > 0) {
            const dayData = weeklyProgress.find((p) => p.day === dayNameToEnglish[dayName]);
            if (dayData && (dayData.words > 0 || dayData.minutes > 0)) {
              isFire = true;
            }
          }

          // If it's today, accurately depend on today's progress
          if (isCurrentDay) {
            if (stats?.todayProgress && stats.todayProgress > 0) {
              isFire = true;
            } else {
              isFire = false;
            }
          } else if (index < currentDayIndex) {
            // Reliable fallback for past days based on current streak
            if ((currentDayIndex - index) <= currentStreak) {
              isFire = true;
            }
          }

          return (
            <View key={index} style={styles.dayCol}>
              <Text
                style={[
                  styles.dayText,
                  isCurrentDay && styles.currentDayText,
                ]}
              >
                {dayName}
              </Text>
              <View
                style={[
                  styles.flameCircle,
                  isFire ? styles.flameCircleActive : styles.flameCircleInactive,
                ]}
              >
                {isFire && <Flame size={20} color="#FF5722" fill="#FF5722" />}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topNav}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatarBorder}>
            <Image
              source={require("../../assets/images/mascot/mochi_transparent.png")}
              style={styles.avatarImg}
            />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Chào mừng trở lại,</Text>
            <Text style={styles.usernameText}>
              {displayName}!
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Bell size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.streakCard}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <View style={styles.streakHeader}>
            <View style={styles.streakTitleRow}>
              <Flame size={20} color="#FF5722" fill="#FF5722" />
              <Text style={styles.streakTitleText}>STREAK</Text>
            </View>
            <Text style={styles.streakSubtitleText}>TIẾP TỤC NÀO</Text>
          </View>
          {renderStreakDays()}
        </TouchableOpacity>

        <LinearGradient
          colors={["#4CAF50", "#8BC34A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerCard}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>
              Chinh phục mục{"\n"}tiêu IELTS
            </Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push("/(tabs)/ielts-prep")}
            >
              <Text style={styles.bannerBtnText}>Bắt đầu ngay</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../../assets/images/mascot/hello_transparent.png")}
            style={styles.bannerMascot}
            resizeMode="contain"
          />
        </LinearGradient>

        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>Tính năng nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.featureViewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresGrid}>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: "#C0C9EE" }]}
              onPress={() => router.push("/(tabs)/notebook")}
            >
              <Text style={[styles.cardTitle, { color: "#3F4D87" }]}>Từ điển</Text>
              <Image
                source={require("../../assets/images/mascot/translate_transparent.png")}
                style={styles.cardImageLeft}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: "#FFCFD1" }]}
              onPress={() => router.push("/speaking" as any)}
            >
              <Text style={[styles.cardTitle, { color: "#EF3D50" }]}>
                IELTS{"\n"}Speaking
              </Text>
              <Image
                source={require("../../assets/images/mascot/speaking-test_transparent.png")}
                style={styles.cardImageRight}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: "#AAEFAD" }]}
              onPress={() => router.push("/(tabs)/courses")}
            >
              <Text style={[styles.cardTitle, { color: "#105036" }]}>Từ vựng</Text>
              <Image
                source={require("../../assets/images/mascot/courses_transparent.png")}
                style={styles.cardImageLeftTall}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: "#B9E1FF" }]}
              onPress={() => router.push("/my-flashcards" as any)}
            >
              <Text style={[styles.cardTitle, { color: "#193368" }]}>Flashcards</Text>
              <Image
                source={require("../../assets/images/mascot/flashcards_transparent.png")}
                style={styles.cardImageCenter}
                resizeMode="contain"
              />
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
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: '#F0F0F0'
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  greetingContainer: {
    justifyContent: "center",
  },
  greetingText: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    color: "#7E7E7E",
  },
  usernameText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    color: "#2C3E50",
    marginTop: 2,
  },
  bellBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  streakCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  streakTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakTitleText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#000000",
    marginLeft: 6,
    letterSpacing: 1,
  },
  streakSubtitleText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    color: "#7E7E7E",
    letterSpacing: 0.5,
  },
  streakDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCol: {
    alignItems: "center",
  },
  dayText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    color: "#A0A0A0",
    marginBottom: 8,
  },
  currentDayText: {
    color: "#4CAF50",
  },
  flameCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  flameCircleActive: {
    backgroundColor: "#FFF1E8",
  },
  flameCircleInactive: {
    backgroundColor: "#F3F4F6",
  },
  bannerCard: {
    borderRadius: 30,
    flexDirection: "row",
    marginTop: 24,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 24,
    overflow: "hidden",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },
  bannerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 16,
    lineHeight: 32,
  },
  bannerBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerBtnText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#4CAF50",
  },
  bannerMascot: {
    width: 150,
    height: 150,
    position: 'absolute',
    right: 0,
    bottom: -10,
  },
  featureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 35,
    marginBottom: 20,
  },
  featureTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#000000",
  },
  featureViewAll: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 2,
  },
  featuresGrid: {
    gap: 15,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  featureCard: {
    flex: 1,
    height: 220,
    borderRadius: 24,
    padding: 18,
    position: "relative",
    overflow: "hidden",
  },
  cardTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    lineHeight: 26,
    zIndex: 2,
  },
  cardImageLeft: {
    width: 200,
    height: 200,
    position: "absolute",
    bottom: -15,
    left: -15,
    zIndex: 1,
  },
  cardImageLeftTall: {
    width: 200,
    height: 200,
    position: "absolute",
    bottom: -15,
    left: -25,
    zIndex: 1,
  },
  cardImageRight: {
    width: 250,
    height: 250,
    position: "absolute",
    bottom: -35,
    right: -30,
    zIndex: 1,
  },
  cardImageCenter: {
    width: 245,
    height: 245,
    position: "absolute",
    bottom: -30,
    alignSelf: "center",
    zIndex: 1,
  }
});
