import { useLocalSearchParams, useRouter } from "expo-router";
import { CupBold, Chart2Bold } from "@solar-icons/react-native";
import { ChevronRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { speakingService } from "../../services/speaking.service";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface SpeakingResult {
  overallScore: number;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  partScores: {
    part: number;
    score: number;
  }[];
}

export default function SpeakingResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullFeedback, setFullFeedback] = useState<any>(null);

  useEffect(() => {
    if (params.feedback) {
      processDirectFeedback();
    } else {
      fetchResult();
    }
  }, [params.id, params.type, params.feedback]);

  const processDirectFeedback = () => {
    try {
      setLoading(true);
      const feedbackData = typeof params.feedback === 'string'
        ? JSON.parse(params.feedback)
        : params.feedback;

      if (!feedbackData) {
        setError('Invalid feedback data');
        setLoading(false);
        return;
      }

      setFullFeedback(feedbackData);
      const overallScore = Number(feedbackData.overall_score) || 0;
      const details = feedbackData.details || {};

      const formattedResult: SpeakingResult = {
        overallScore,
        fluencyScore: details.fluency?.score || 0,
        lexicalScore: details.vocabulary?.score || 0,
        grammarScore: details.grammar?.score || 0,
        pronunciationScore: details.pronunciation?.score || 0,
        partScores: [
          { part: 1, score: details.fluency?.score || 0 },
          { part: 2, score: details.vocabulary?.score || 0 },
          { part: 3, score: details.grammar?.score || 0 },
        ],
      };

      setResult(formattedResult);
      setError(null);
    } catch (err) {
      console.error('Error processing feedback:', err);
      setError('Failed to process result');
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async () => {
    try {
      setLoading(true);
      const id = params.id ? parseInt(params.id as string) : null;
      const type = params.type as 'practice' | 'test' | undefined;

      if (!id || !type) {
        setError('Invalid parameters');
        setLoading(false);
        return;
      }

      const historyItem = await speakingService.getHistoryItem(id, type);
      if (!historyItem || !historyItem.details) {
        setError('No data found');
        setLoading(false);
        return;
      }

      const details = historyItem.details;
      const overallScore = Number(historyItem.overall_score) || 0;

      const feedbackToPass = {
        overall_score: details.overall_score || overallScore,
        transcript: details.transcript || '',
        details: {
          fluency: details.fluency,
          pronunciation: details.pronunciation,
          grammar: details.grammar,
          vocabulary: details.vocabulary,
        },
        general_suggestions: historyItem.general_suggestions || [],
      };
      setFullFeedback(feedbackToPass);

      const formattedResult: SpeakingResult = {
        overallScore,
        fluencyScore: details.fluency?.score || 0,
        lexicalScore: details.vocabulary?.score || 0,
        grammarScore: details.grammar?.score || 0,
        pronunciationScore: details.pronunciation?.score || 0,
        partScores: [
          { part: 1, score: details.fluency?.score || 0 },
          { part: 2, score: details.vocabulary?.score || 0 },
          { part: 3, score: details.grammar?.score || 0 },
        ],
      };

      setResult(formattedResult);
      setError(null);
    } catch (err) {
      console.error('Error fetching result:', err);
      setError('Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#01BD50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          <View style={styles.resultCard}>
            {/* Badge (Middle Scale) */}
            <View style={styles.badgeWrapper}>
              <LinearGradient
                colors={["#FFD60A", "#FF9F0A"]}
                style={styles.badgeGradient}
              >
                <CupBold size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.congratsTitle}>Congratulations!</Text>
            <Text style={styles.hasCompleted}>has completed Speaking Test</Text>

            {/* Overall Score (Middle Scale) */}
            <View style={styles.overallContainer}>
              <Text style={styles.overallScoreText}>
                {result?.overallScore.toFixed(1)}
              </Text>
              <Text style={styles.overallLabelText}>OVERALL</Text>
            </View>

            {/* Detailed Criteria (Distributed) */}
            <View style={styles.criteriaList}>
              <CriterionRow label="Fluency and Coherence" score={result?.fluencyScore || 0} />
              <CriterionRow label="Lexical Resource" score={result?.lexicalScore || 0} />
              <CriterionRow label="Grammar Range & Accuracy" score={result?.grammarScore || 0} />
              <CriterionRow label="Pronunciation" score={result?.pronunciationScore || 0} />
            </View>

            {/* Performance Title */}
            <Text style={styles.performanceTitle}>Performance by Part</Text>

            {/* Part Cards */}
            <View style={styles.partsRow}>
              {[1, 2, 3].map((partNum) => (
                <View key={partNum} style={styles.partTinyCard}>
                  <Chart2Bold size={22} color="#01BD50" />
                  <Text style={styles.partLabel}>Part {partNum}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons (Repositioned) */}
        <View style={styles.actionContainer}>
            <TouchableOpacity
            style={styles.viewDetailsBtn}
            onPress={() => {
                if (fullFeedback) {
                    router.push({
                      pathname: "/speaking/feedback",
                      params: { feedback: JSON.stringify(fullFeedback) }
                    } as any);
                  }
            }}
            activeOpacity={0.8}
            >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <ChevronRight color="#FFFFFF" size={18} strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={() => router.replace("/(tabs)" as any)}
            activeOpacity={0.7}
            >
            <Text style={styles.backHomeText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CriterionRow = ({ label, score }: { label: string; score: number }) => (
  <View style={styles.criterionRow}>
    <Text style={styles.criterionScore}>{score.toFixed(1)}</Text>
    <Text style={styles.criterionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 26 : 50,
    paddingBottom: 10,
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    padding: 1,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#00BD50",
    marginBottom: 24, // Reduced by exactly 1px from 25
    backgroundColor: "#FFFFFF",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  badgeWrapper: {
    marginTop: -5,
    marginBottom: 15,
    shadowColor: "#FF9F0A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  badgeGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  congratsTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: "#1A2138",
    marginBottom: 6,
  },
  hasCompleted: {
    fontFamily: "Nunito_400Regular",
    fontSize: 17,
    color: "#6B7280",
    marginBottom: 20,
  },
  overallContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  overallScoreText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 72,
    color: "#1F2937",
    lineHeight: 75,
  },
  overallLabelText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#9CA3AF",
    letterSpacing: 2,
  },
  criteriaList: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  criterionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  criterionScore: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#01BD50",
    width: 45,
  },
  criterionLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#4B5563",
    flex: 1,
  },
  performanceTitle: {
    alignSelf: "flex-start",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 17,
    color: "#1F2937",
    marginBottom: 15,
  },
  partsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "space-between",
  },
  partTinyCard: {
    flex: 1,
    height: 70,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#B7FFBD",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  partLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: "#4B5563",
  },
  actionContainer: {
    width: "100%",
    alignItems: "center",
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01BD50",
    width: "100%",
    height: 64,
    borderRadius: 22,
    gap: 8,
    marginBottom: 10,
    shadowColor: "#01BD50",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  viewDetailsText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  backHomeBtn: {
    paddingVertical: 10,
  },
  backHomeText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 17,
    color: "#0185E8",
  },
});
