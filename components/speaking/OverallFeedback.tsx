import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";

const { width } = Dimensions.get("window");

interface OverallFeedbackProps {
  data: {
    score: number;
    scores: {
      pronunciation: number;
      fluency: number;
      grammar: number;
      vocabulary: number;
    };
    congratulations: string;
    general_suggestions: string;
  };
}

// Pentagon Chart Component
interface PentagonChartProps {
  scores: { label: string; value: number }[];
  overallScore: number;
}

const PentagonChart: React.FC<PentagonChartProps> = ({ scores, overallScore }) => {
  const size = 280;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = 85;
  const maxScore = 9.0;

  // Pentagon points (5 vertices) - starting from top and going clockwise
  const getPoint = (index: number, score: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2; // Start from top
    const radius = (score / maxScore) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Data points for the score pentagon (5 criteria)
  // 0: Overall (Top)
  // 1: Fluency (Right)
  // 2: Lexical (Bottom Right)
  // 3: Grammar (Bottom Left)
  // 4: Pronunciation (Left)
  const dataPoints = [
    getPoint(0, overallScore),
    getPoint(1, scores[0].value),
    getPoint(2, scores[1].value),
    getPoint(3, scores[2].value),
    getPoint(4, scores[3].value),
  ];

  // Background grid pentagons
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <View style={{ alignItems: "center", paddingVertical: 10 }}>
      <Svg width={size} height={size}>
        {/* Background grid pentagons */}
        {gridLevels.map((level, idx) => {
          const gridPoints = Array.from({ length: 5 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const radius = maxRadius * level;
            return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
          }).join(" ");

          return (
            <Polygon
              key={idx}
              points={gridPoints}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}

        {/* Score polygon filled area */}
        <Polygon
          points={dataPoints.map(p => `${p.x},${p.y}`).join(" ")}
          fill="rgba(34, 197, 94, 0.15)" // #E4F8EC approx
          stroke="#22C55E"
          strokeWidth="2.5"
        />

        {/* Score points as circles */}
        {dataPoints.map((point, idx) => (
          <Circle key={idx} cx={point.x} cy={point.y} r="3.5" fill="#22C55E" />
        ))}
      </Svg>

      {/* Labels and scores around the pentagon */}
      <View style={styles.pentagonLabels}>
        {/* Top - Overall */}
        <View style={[styles.labelContainer, { top: 0, alignSelf: "center" }]}>
          <Text style={styles.scoreValue}>{overallScore.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Overall</Text>
        </View>

        {/* Right - Fluency */}
        <View style={[styles.labelContainer, { top: 75, right: 0 }]}>
          <Text style={styles.scoreValue}>{scores[0].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Fluency &{"\n"}Coherence</Text>
        </View>

        {/* Bottom Right - Lexical */}
        <View style={[styles.labelContainer, { bottom: 35, right: 25 }]}>
          <Text style={styles.scoreValue}>{scores[1].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Lexical{"\n"}Resource</Text>
        </View>

        {/* Bottom Left - Grammar */}
        <View style={[styles.labelContainer, { bottom: 35, left: 25 }]}>
          <Text style={styles.scoreValue}>{scores[2].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Grammatical{"\n"}Accuracy</Text>
        </View>

        {/* Left - Pronunciation */}
        <View style={[styles.labelContainer, { top: 75, left: 0 }]}>
          <Text style={styles.scoreValue}>{scores[3].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Pronunciation</Text>
        </View>
      </View>
    </View>
  );
};

const OverallFeedback: React.FC<OverallFeedbackProps> = ({ data }) => {
  return (
    <ScrollView
      style={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Score Card - Large White Card */}
      <View style={styles.whiteCard}>
        <PentagonChart
          scores={[
            { label: "Fluency", value: data.scores.fluency },
            { label: "Lexical", value: data.scores.vocabulary },
            { label: "Grammar", value: data.scores.grammar },
            { label: "Pronunciation", value: data.scores.pronunciation },
          ]}
          overallScore={data.score}
        />
      </View>

      {/* Congratulations Card */}
      <View style={styles.whiteCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🎉</Text>
          <Text style={styles.sectionTitle}>Congratulation</Text>
        </View>
        <Text style={styles.sectionContent}>{data.congratulations}</Text>
      </View>

      {/* Feedback Card */}
      <View style={styles.whiteCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💪</Text>
          <Text style={styles.sectionTitle}>Feedback</Text>
        </View>
        <View style={styles.feedbackList}>
          {data.general_suggestions.split(". ").map((point, index) => (
            point.trim().length > 0 && (
              <View key={index} style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>{point.trim()}{point.endsWith(".") ? "" : "."}</Text>
              </View>
            )
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Light gray/blue bg
  },
  whiteCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    padding: 20,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  pentagonLabels: {
    position: "relative",
    width: 280,
    height: 280,
    marginTop: -280,
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
    width: 100,
  },
  scoreValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: "#22C55E",
    marginBottom: 2,
  },
  scoreLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#1F2937",
  },
  sectionContent: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
  feedbackList: {
    width: "100%",
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 22,
  },
});

export default OverallFeedback;
