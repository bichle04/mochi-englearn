import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Flame, Bell, Search } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ExploreScreen() {
  const handleSearchPress = () => {
    router.push("/search");
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Khám phá</Text>
        <View style={styles.headerIcons}>
          <View style={styles.flameContainer}>
            <Flame size={20} color="#EA580C" fill="#EA580C" />
            <Text style={styles.flameText}>5</Text>
          </View>
          <TouchableOpacity>
            <Bell size={24} color="#55BA5D" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar (Static, acts as a button) */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.8}
        onPress={handleSearchPress}
      >
        <Search size={20} color="#A0AEC0" />
        <Text style={styles.searchText}>Tìm kiếm chủ đề, từ vựng ...</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dành cho bạn Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dành cho bạn</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {/* Card 1 */}
          <TouchableOpacity 
            style={styles.largeCard} 
            activeOpacity={0.9}
            onPress={() => router.push('/course/business')}
          >
            <View style={styles.largeCardImageContainer}>
              <Image
                source={require("../../assets/images/explore/business.png")}
                style={styles.largeCardImage}
              />
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.5)"]}
                locations={[0.4, 1]}
                style={styles.largeCardGradient}
              />
              <View style={[styles.tagBadge, { backgroundColor: "#93C5FD" }]}>
                <Text style={styles.tagText}>Kinh doanh</Text>
              </View>
            </View>
            <View style={styles.largeCardContent}>
              <Text style={styles.largeCardTitle}>Từ vựng về kinh doanh</Text>
              <Text style={styles.largeCardSubtitle}>24 Bài học</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: "60%", backgroundColor: "#AFCFF6" },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.largeCard} activeOpacity={0.9}>
            <View style={styles.largeCardImageContainer}>
              <Image
                source={require("../../assets/images/explore/travel.png")}
                style={styles.largeCardImage}
              />
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.5)"]}
                locations={[0.4, 1]}
                style={styles.largeCardGradient}
              />
              <View style={[styles.tagBadge, { backgroundColor: "#FDBA74" }]}>
                <Text style={styles.tagText}>Du lịch</Text>
              </View>
            </View>
            <View style={styles.largeCardContent}>
              <Text style={styles.largeCardTitle}>Từ vựng về du lịch</Text>
              <Text style={styles.largeCardSubtitle}>18 Bài học</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: "30%", backgroundColor: "#FECB7C" },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Chủ đề nổi bật Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Chủ đề nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.highlightGrid}>
          {/* Highlight Item 1 */}
          <TouchableOpacity style={styles.highlightCard} activeOpacity={0.9}>
            <ImageBackground
              source={require("../../assets/images/explore/writing.png")}
              style={styles.highlightImage}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
                locations={[0.3, 1]}
                style={styles.highlightOverlay}
              >
                <Text style={styles.highlightTitle}>Viết học thuật</Text>
                <Text style={styles.highlightSubtitle}>12 Bài học</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          {/* Highlight Item 2 */}
          <TouchableOpacity style={styles.highlightCard} activeOpacity={0.9}>
            <ImageBackground
              source={require("../../assets/images/explore/presentation.png")}
              style={styles.highlightImage}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
                locations={[0.3, 1]}
                style={styles.highlightOverlay}
              >
                <Text style={styles.highlightTitle}>Thuyết trình</Text>
                <Text style={styles.highlightSubtitle}>8 Bài học</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          {/* Highlight Item 3 */}
          <TouchableOpacity style={styles.highlightCard} activeOpacity={0.9}>
            <ImageBackground
              source={require("../../assets/images/explore/communication.png")}
              style={styles.highlightImage}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
                locations={[0.3, 1]}
                style={styles.highlightOverlay}
              >
                <Text style={styles.highlightTitle}>Giao tiếp hàng ngày</Text>
                <Text style={styles.highlightSubtitle}>15 Bài học</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          {/* Highlight Item 4 */}
          <TouchableOpacity style={styles.highlightCard} activeOpacity={0.9}>
            <ImageBackground
              source={require("../../assets/images/explore/art.png")}
              style={styles.highlightImage}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
                locations={[0.3, 1]}
                style={styles.highlightOverlay}
              >
                <Text style={styles.highlightTitle}>Nghệ thuật</Text>
                <Text style={styles.highlightSubtitle}>10 Bài học</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 26,
    color: "#0F172A",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  flameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  flameText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#EA580C",
    marginLeft: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  searchText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#9CA3AF",
    marginLeft: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#0F172A",
  },
  seeAllText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: "#55BA5D",
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  largeCard: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  largeCardImageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  largeCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  largeCardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  tagBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  largeCardContent: {
    padding: 16,
  },
  largeCardTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 4,
  },
  largeCardSubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#64748B",
    marginBottom: 16,
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  highlightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  highlightCard: {
    width: "48%",
    aspectRatio: 1.2,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  highlightImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  highlightOverlay: {
    padding: 12,
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 20,
  },
  highlightTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  highlightSubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#E2E8F0",
  },
});

