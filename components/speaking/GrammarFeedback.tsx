import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface GrammarFeedbackProps {
  data: {
    score: number;
    evaluation: Array<{
      criteria: string;
      description: string;
    }>;
    errors: Array<{
      original: string;
      suggested: string;
      explanation: string;
    }>;
    feedback: string;
  };
}

const GrammarFeedback: React.FC<GrammarFeedbackProps> = ({ data }) => {
  const strengths = data.evaluation.filter((_, i) => i % 2 === 0);
  const weaknesses = data.evaluation.filter((_, i) => i % 2 !== 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.summaryHeader}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{data.score.toFixed(1)}</Text>
        </View>
        <Text style={styles.summaryTitle}>Feedback Summary</Text>
      </View>
      <Text style={styles.summaryText}>{data.feedback}</Text>

      <View style={[styles.card, { backgroundColor: "#F0FFF5" }]}>
        <View style={[styles.pillLabel, { backgroundColor: "#22C55E" }]}>
          <Text style={styles.pillText}>STRENGTHS</Text>
        </View>
        {strengths.map((item, idx) => (
          <Text key={idx} style={styles.cardContent}>{item.description}</Text>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: "#FFF7ED" }]}>
        <View style={[styles.pillLabel, { backgroundColor: "#F97316" }]}>
          <Text style={styles.pillText}>WEAKNESSES</Text>
        </View>
        {weaknesses.map((item, idx) => (
          <Text key={idx} style={styles.cardContent}>{item.description}</Text>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: "#EFF6FF" }]}>
        <View style={[styles.pillLabel, { backgroundColor: "#3B82F6" }]}>
          <Text style={styles.pillText}>IMPROVEMENTS</Text>
        </View>
        <Text style={styles.cardContent}>
          Try to incorporate more complex structures like conditional sentences and passive voice to reach a higher band score.
        </Text>
      </View>

      {data.errors && data.errors.length > 0 && (
        <View style={styles.correctionsWrapper}>
          <View style={styles.sectionHeaderRed}>
            <Text style={styles.sectionTitleRed}>Detailed Corrections</Text>
          </View>
          {data.errors.map((error, index) => (
            <View key={index} style={styles.correctionBlock}>
              <View style={styles.correctionSubBlockRed}>
                <Text style={styles.correctionLabelRed}>ORIGINAL</Text>
                <Text style={styles.correctionTextBlack}>{error.original}</Text>
              </View>
              <View style={styles.correctionSubBlockGreen}>
                <Text style={styles.correctionLabelGreen}>SUGGESTED</Text>
                <Text style={styles.correctionTextBlack}>{error.suggested}</Text>
              </View>
              <View style={styles.explanationPart}>
                <Text style={styles.explanationLabel}>EXPLANATION</Text>
                <Text style={styles.explanationContent}>{error.explanation}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 20 },
  summaryHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  scoreCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#22C55E", alignItems: "center", justifyContent: "center", marginRight: 12 },
  scoreText: { fontFamily: "Nunito_800ExtraBold", fontSize: 18, color: "#FFFFFF" },
  summaryTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: 22, color: "#1F2937" },
  summaryText: { fontFamily: "Nunito_400Regular", fontSize: 16, color: "#4B5563", lineHeight: 24, marginBottom: 25 },
  card: { borderRadius: 15, padding: 16, marginBottom: 20, alignItems: "flex-start" },
  pillLabel: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 12 },
  pillText: { fontFamily: "Nunito_800ExtraBold", fontSize: 11, color: "#FFFFFF", letterSpacing: 0.5 },
  cardContent: { fontFamily: "Nunito_600SemiBold", fontSize: 15, color: "#374151", lineHeight: 22 },
  correctionsWrapper: { marginTop: 10, paddingBottom: 40 },
  sectionHeaderRed: { backgroundColor: "#FFF8F8", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  sectionTitleRed: { fontFamily: "Nunito_800ExtraBold", fontSize: 18, color: "#DC2626" },
  correctionBlock: { backgroundColor: "#FFFFFF", borderRadius: 15, borderWidth: 1, borderColor: "#F3F4F6", overflow: "hidden", marginBottom: 20 },
  correctionSubBlockRed: { backgroundColor: "#FFF8F8", padding: 16, borderBottomWidth: 1, borderBottomColor: "#FEE2E2" },
  correctionSubBlockGreen: { backgroundColor: "#F0FFF5", padding: 16, borderBottomWidth: 1, borderBottomColor: "#BBF7D0" },
  correctionLabelRed: { fontFamily: "Nunito_800ExtraBold", fontSize: 12, color: "#DC2626", marginBottom: 6 },
  correctionLabelGreen: { fontFamily: "Nunito_800ExtraBold", fontSize: 12, color: "#22C55E", marginBottom: 6 },
  correctionTextBlack: { fontFamily: "Nunito_700Bold", fontSize: 15, color: "#1F2937", lineHeight: 20 },
  explanationPart: { padding: 16 },
  explanationLabel: { fontFamily: "Nunito_800ExtraBold", fontSize: 12, color: "#94A3B8", marginBottom: 6 },
  explanationContent: { fontFamily: "Nunito_400Regular", fontSize: 14, color: "#4B5563", lineHeight: 20 },
});

export default GrammarFeedback;
