import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

interface HeaderWithBackProps {
  title: string;
  onBackPress?: () => void;
}

export default function HeaderWithBack({ title, onBackPress }: HeaderWithBackProps) {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/personal");
    }
  };
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <ArrowLeft size={24} color="#000000" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={{ width: 28 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  backBtn: {
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#2E3A59", // Dựa theo màu tiêu đề ở personal.tsx
    letterSpacing: -0.5,
  },
});
