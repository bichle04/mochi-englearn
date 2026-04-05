import { speakingService } from "@/services/speaking.service";
import { SpeakingPart, SpeakingTopic } from "@/types/speaking";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import {
  ArrowLeft,
  ChevronRight,
  Palette,
  Cake,
  User,
  Cookie,
  Globe,
  Briefcase,
  Home,
  MessageSquare
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function PracticeMode() {
  const [selectedPart, setSelectedPart] = useState<SpeakingPart | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [topics, setTopics] = useState<SpeakingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePartSelect = (part: SpeakingPart) => {
    setSelectedPart(part);
    setSelectedTopicId(null);
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  const handleStartPractice = () => {
    if (selectedTopicId) {
      router.push({
        pathname: "/speaking/room" as any,
        params: {
          mode: "practice",
          topicId: selectedTopicId,
        },
      });
    }
  };

  useEffect(() => {
    async function fetchTopics() {
      if (selectedPart) {
        setIsLoading(true);
        const data = await speakingService.getTopicsByPart(selectedPart);
        setTopics(data);
        setIsLoading(false);
      } else {
        setTopics([]);
      }
    }
    fetchTopics();
  }, [selectedPart]);

  // Safe Icon Mapping using Lucide (already installed and stable)
  const getTopicIcon = (title: string) => {
    const t = title.toLowerCase();
    let Icon = MessageSquare;
    let color = "#6B7280";

    if (t.includes("art")) { Icon = Palette; color = "#FF7E21"; }
    else if (t.includes("birth")) { Icon = Cake; color = "#EF44BD"; }
    else if (t.includes("intro") || t.includes("person")) { Icon = User; color = "#3B82F6"; }
    else if (t.includes("choc") || t.includes("food")) { Icon = Cookie; color = "#854D0E"; }
    else if (t.includes("work") || t.includes("job")) { Icon = Briefcase; color = "#10B981"; }
    else if (t.includes("home")) { Icon = Home; color = "#6366F1"; }
    else if (t.includes("travel") || t.includes("world")) { Icon = Globe; color = "#06B6D4"; }

    return <Icon size={28} color={color} />;
  };

  const getTopicIconBg = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("art")) return "#FFF1E6";
    if (t.includes("birth")) return "#FCE7F6";
    if (t.includes("intro")) return "#EFF6FF";
    if (t.includes("choc")) return "#FEF9C3";
    if (t.includes("work")) return "#ECFDF5";
    if (t.includes("home")) return "#EEF2FF";
    if (t.includes("travel")) return "#ECFEFF";
    return "#F3F4F6";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={28} color="#545454" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Luyện tập</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Chọn Part */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn Part</Text>
          <View style={styles.partContainer}>
            {[1, 2, 3].map((part) => (
              <TouchableOpacity
                key={part}
                style={[
                  styles.partCard,
                  selectedPart === part && styles.partCardSelected,
                ]}
                onPress={() => handlePartSelect(part as SpeakingPart)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.partNumber,
                    selectedPart === part && styles.partNumberSelected,
                  ]}
                >
                  Part {part}
                </Text>
                <Text
                  style={[
                    styles.partSub,
                    selectedPart === part && styles.partSubSelected,
                  ]}
                >
                  {part === 1 && "Introduction"}
                  {part === 2 && "Long Turn"}
                  {part === 3 && "Discussion"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section: Chọn chủ đề */}
        {selectedPart && (
          <View style={[styles.section, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Chọn chủ đề</Text>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  selectedTopicId === topic.id && styles.topicCardSelected,
                ]}
                onPress={() => handleTopicSelect(topic.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.topicIconContainer, { backgroundColor: getTopicIconBg(topic.title) }]}>
                  {getTopicIcon(topic.title)}
                </View>
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDescription} numberOfLines={2}>
                    {topic.description}
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={selectedTopicId === topic.id ? "#58CC02" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
            {topics.length === 0 && !isLoading && (
              <Text style={styles.emptyText}>Chưa có chủ đề nào cho phần này.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer Start Button */}
      {selectedTopicId && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPractice}
            activeOpacity={0.9}
          >
            <Text style={styles.startButtonText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 24,
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for footer button
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#2E3A59",
    marginBottom: 20,
  },
  partContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  partCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 18, // Reduced from 25
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  partCardSelected: {
    borderColor: "#58CC02",
    backgroundColor: "#F0FFF5",
    borderWidth: 2,
  },
  partNumber: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#374151",
    marginBottom: 2, // Reduced from 6
  },
  partNumberSelected: {
    color: "#58CC02",
  },
  partSub: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: "#9CA3AF",
  },
  partSubSelected: {
    color: "#58CC02",
  },
  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  topicCardSelected: {
    borderColor: "#58CC02",
    backgroundColor: "#F0FFF5",
  },
  topicIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#1F2937",
    marginBottom: 4,
  },
  topicDescription: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  startButton: {
    backgroundColor: "#55BA5D",
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#55BA5D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  emptyText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 40,
  },
});
