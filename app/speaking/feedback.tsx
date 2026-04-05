import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import FluencyFeedback from "../../components/speaking/FluencyFeedback";
import GrammarFeedback from "../../components/speaking/GrammarFeedback";
import LexicalFeedback from "../../components/speaking/LexicalFeedback";
import OverallFeedback from "../../components/speaking/OverallFeedback";
import PronunciationFeedback from "../../components/speaking/PronunciationFeedback";

// Tab types
type FeedbackTab = "overall" | "fluency" | "lexical" | "grammar" | "pronunciation";

interface TabItem {
  key: FeedbackTab;
  label: string;
  shortLabel?: string;
}

const TABS: TabItem[] = [
  { key: "overall", label: "Overall", shortLabel: "Overall" },
  { key: "fluency", label: "Fluency", shortLabel: "Fluency" },
  { key: "lexical", label: "Lexical", shortLabel: "Lexical" },
  { key: "grammar", label: "Grammar", shortLabel: "Grammar" },
  { key: "pronunciation", label: "Pronunciation", shortLabel: "Pronun" },
];

export interface DetailedFeedback {
  overall_score: number;
  transcript: string;
  details: {
    fluency: any;
    pronunciation: any;
    grammar: any;
    vocabulary: any;
  };
  general_suggestions: string[];
}

export default function SpeakingFeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<FeedbackTab>("overall");
  const [feedback, setFeedback] = useState<DetailedFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (params.feedback && typeof params.feedback === 'string') {
        const parsedFeedback = JSON.parse(params.feedback);
        setFeedback(parsedFeedback);
      }
    } catch (error) {
      console.error("Error parsing feedback:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.feedback]);

  const mapFeedbackData = (fb: DetailedFeedback) => {
    return {
      overall: {
        score: fb.overall_score,
        scores: {
          pronunciation: fb.details.pronunciation.score,
          fluency: fb.details.fluency.score,
          grammar: fb.details.grammar.score,
          vocabulary: fb.details.vocabulary.score,
        },
        congratulations: "Great job on completing the test!",
        general_suggestions: fb.general_suggestions.join('. '),
      },
      fluency: fb.details.fluency,
      lexical: fb.details.vocabulary,
      grammar: fb.details.grammar,
      pronunciation: fb.details.pronunciation,
    };
  };

  const mappedFeedback = feedback ? mapFeedbackData(feedback) : null;

  const renderTabContent = () => {
    if (isLoading || !mappedFeedback) return <View style={styles.placeholder}><Text>Loading...</Text></View>;

    switch (activeTab) {
      case "overall": return <OverallFeedback data={mappedFeedback.overall} />;
      case "fluency": return <FluencyFeedback data={mappedFeedback.fluency} />;
      case "lexical": return <LexicalFeedback data={mappedFeedback.lexical} />;
      case "grammar": return <GrammarFeedback data={mappedFeedback.grammar} />;
      case "pronunciation": return <PronunciationFeedback data={mappedFeedback.pronunciation} />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Optimized White Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color="#1F2937" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Modern Tabs Bar */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive
              ]}>
                {tab.shortLabel}
              </Text>
              {activeTab === tab.key && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={{ flex: 1 }}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 10,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#1A2138",
  },
  tabsWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#94A3B8",
  },
  tabTextActive: {
    color: "#22C55E",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 3,
    backgroundColor: "#22C55E",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
