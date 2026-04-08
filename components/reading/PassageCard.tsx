import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MessageSquare, User, Users, Clock } from "lucide-react-native";

export interface PassageCardProps {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  iconBg: string;
  iconName: "message" | "user-voice" | "users";
  onPress: () => void;
}

export const PassageCard: React.FC<PassageCardProps> = ({ title, difficulty, time, iconBg, iconName, onPress }) => {
  const getTagStyle = (diff: string) => {
    switch (diff) {
      case "Easy": return { bg: "#E8F5E9", color: "#4CAF50" };
      case "Medium": return { bg: "#FFF0DC", color: "#E88B27" }; // matched the orange from the image roughly
      case "Hard": return { bg: "#DFF0FF", color: "#2B7BBA" }; // matched the blue from the image
      default: return { bg: "#F3F4F6", color: "#6B7280" };
    }
  };

  const getIconColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "#4CAF50";
      case "Medium": return "#E88B27"; // matching orange
      case "Hard": return "#2B7BBA"; // matching blue
      default: return "#6B7280";
    }
  };

  const tagStyle = getTagStyle(difficulty);
  const iconColor = getIconColor(difficulty);

  const renderIcon = () => {
    switch (iconName) {
      case "message": return <MessageSquare color={iconColor} size={28} strokeWidth={1.5} />;
      case "user-voice": return <User color={iconColor} size={30} strokeWidth={1.5} />;
      case "users": return <Users color={iconColor} size={30} strokeWidth={1.5} />;
      default: return <MessageSquare color={iconColor} size={28} strokeWidth={1.5} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          {renderIcon()}
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={[styles.tag, { backgroundColor: tagStyle.bg }]}>
            <Text style={[styles.tagText, { color: tagStyle.color }]}>
              {difficulty}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.timeBox}>
          <Clock color="#545454" size={16} strokeWidth={2} />
          <Text style={styles.timeText}>{time}</Text>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={onPress}>
          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#193368",
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 13,
    color: "#545454",
  },
  startBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  startBtnText: {
    fontFamily: "WorkSans_700Bold",
    color: "#FFFFFF",
    fontSize: 15,
  },
});
