import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  TextInput
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  List as FilterList,
  ChevronUp
} from "lucide-react-native";
import { 
  StarsLinear, 
  ListLinear, 
  DocumentsLinear, 
  UserIdLinear 
} from "@solar-icons/react-native";
import { lessonsMock, partDetailsMock, ListeningLesson } from "@/mocks/listening";

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function ListeningLessonsScreen() {
  const { id } = useLocalSearchParams();
  const [activeLevel, setActiveLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  
  const partData = partDetailsMock[id as string] || partDetailsMock["part1"];

  // Filtering Logic
  const filteredLessons = useMemo(() => {
    return lessonsMock.filter((lesson) => {
      const matchPart = lesson.partId === (id || "part1");
      const matchLevel = activeLevel === "All Levels" || lesson.level === activeLevel;
      const matchSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPart && matchLevel && matchSearch;
    });
  }, [id, activeLevel, searchQuery]);

  const renderIcon = (iconName: string, size: number, color: string) => {
    switch (iconName) {
      case "star": return <StarsLinear size={size} color={color} />;
      case "list": return <ListLinear size={size} color={color} />;
      case "document": return <DocumentsLinear size={size} color={color} />;
      case "id-card": return <UserIdLinear size={size} color={color} />;
      default: return <StarsLinear size={size} color={color} />;
    }
  };

  const getLevelColors = (level: string) => {
    switch (level) {
      case "Beginner":
        return { text: "#55BA5D", bg: "#E6FED9", border: "#D3FFBA" };
      case "Intermediate":
        return { text: "#E56B00", bg: "#FFEBC6", border: "#FFD6B2" };
      case "Advanced":
        return { text: "#B02500", bg: "#FEEEEA", border: "#F6DAD3" };
      default:
        return { text: "#55BA5D", bg: "#E6FED9", border: "#D3FFBA" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{partData.partLabel}: {partData.badgeName.toLowerCase().split(' ').map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#585C61" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#585C61"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Level Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterList}
          contentContainerStyle={styles.filterContent}
        >
          {levels.map((level) => (
            <TouchableOpacity 
              key={level} 
              activeOpacity={0.7}
              onPress={() => setActiveLevel(level)}
              style={[
                styles.levelTab, 
                activeLevel === level && styles.activeLevelTab
              ]}
            >
              <Text style={[
                styles.levelTabText, 
                activeLevel === level && styles.activeLevelTabText
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Count and Filter Icon */}
        <View style={styles.listHeader}>
          <Text style={styles.countText}>{filteredLessons.length} BÀI CÓ SẴN</Text>
          <TouchableOpacity>
            <FilterList size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Lessons List */}
        {filteredLessons.length > 0 ? (
          filteredLessons.map((item: ListeningLesson) => {
            const colors = getLevelColors(item.level);
            return (
              <View key={item.id} style={styles.lessonCard}>
                <View style={styles.cardMain}>
                  <View style={[styles.iconBg, { backgroundColor: item.iconBg }]}>
                    {renderIcon(item.iconName, 32, item.iconColor)}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.lessonTitle}>{item.title}</Text>
                    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                      <Text style={[styles.badgeText, { color: colors.text }]}>{item.level.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.cardFooter}>
                  <View style={styles.infoRow}>
                    <FileText size={18} color="#585C61" />
                    <Text style={styles.infoText}>{item.questions} questions</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.startButton} 
                    activeOpacity={0.8}
                    onPress={() => {
                      if (item.id === "p1-l2") {
                        router.push("/listening/sentence-quiz");
                      } else {
                        router.push("/listening/quiz");
                      }
                    }}
                  >
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy bài học nào phù hợp.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#000",
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E6EBF2",
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "WorkSans_400Regular",
    fontSize: 16,
    color: "#000",
  },
  filterList: {
    marginBottom: 25,
  },
  filterContent: {
    paddingRight: 20,
  },
  levelTab: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6EBF2",
    marginRight: 12,
  },
  activeLevelTab: {
    backgroundColor: "#55BA5D",
    borderColor: "#55BA5D",
  },
  levelTabText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 15,
    color: "#585C61",
  },
  activeLevelTabText: {
    color: "#FFFFFF",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  countText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 13,
    color: "#585C61",
    letterSpacing: 1,
  },
  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 17,
    color: "#000",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  badgeText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginVertical: 15,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: "#585C61",
    marginLeft: 10,
  },
  startButton: {
    backgroundColor: "#55BA5D",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 16,
    color: "#585C61",
  },
});
