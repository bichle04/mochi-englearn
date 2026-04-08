import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { ArrowLeft, Search, X, Bookmark } from "lucide-react-native";
import { router, Stack } from "expo-router";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("Pri");

  const dictionarySuggestions = [
    {
      word: "Pristine",
      match: "Pri",
      rest: "stine",
      level: "C1",
      definition: "Trong tình trạng nguyên bản; nguyên sơ.",
    },
    {
      word: "Primary",
      match: "Pri",
      rest: "mary",
      level: "B2",
      definition: "Có tầm quan trọng hàng đầu; chủ yếu.",
    },
    {
      word: "Prioritize",
      match: "Pri",
      rest: "oritize",
      level: "C1",
      definition: "Dành ưu tiên; coi trọng hơn.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={20} color="#55BA5D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#9CA3AF"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dictionary Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GỢI Ý TỪ VỰNG</Text>
          {dictionarySuggestions.map((item, index) => (
            <View key={index} style={styles.suggestionItem}>
              <View style={styles.wordRow}>
                <Text style={styles.wordText}>
                  <Text style={{ color: "#55BA5D", fontFamily: "Lexend_700Bold" }}>{item.match}</Text>
                  <Text style={{ fontFamily: "Lexend_700Bold", color: "#0F172A"}}>{item.rest}</Text>
                </Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{item.level}</Text>
                </View>
              </View>
              <Text style={styles.definitionText}>{item.definition}</Text>
            </View>
          ))}
        </View>

        {/* In Your Notebook */}
        <View style={styles.section}>
          <View style={styles.notebookHeaderRow}>
            <Bookmark size={16} color="#55BA5D" />
            <Text style={[styles.sectionTitle, { marginLeft: 8, marginBottom: 0 }]}>
              TRONG SỔ TAY CỦA BẠN
            </Text>
          </View>
          
          <View style={styles.notebookCard}>
            <View>
              <Text style={styles.wordText}>
                <Text style={{ color: "#55BA5D", fontFamily: "Lexend_700Bold" }}>Pri</Text>
                <Text style={{ fontFamily: "Lexend_700Bold", color: "#0F172A"}}>vilege</Text>
              </Text>
              <Text style={styles.definitionText}>Đã thêm 2 ngày trước</Text>
            </View>
            <Bookmark size={20} color="#55BA5D" />
          </View>
        </View>
        
        <View style={styles.divider} />

        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={styles.recentSearchesTitle}>TÌM KIẾM GẦN ĐÂY</Text>
          <View style={styles.tagsContainer}>
            {["Từ vựng", "Viết Task 2", "Thành ngữ"].map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagTextItem}>{tag}</Text>
                <TouchableOpacity style={styles.tagClose}>
                  <X size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#0F172A",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2F0E5", // very light green
    borderWidth: 1,
    borderColor: "#55BA5D",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: "#0F172A",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: "#55BA5D",
    letterSpacing: 1,
    marginBottom: 16,
  },
  suggestionItem: {
    marginBottom: 20,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  wordText: {
    fontSize: 16,
  },
  levelBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    color: "#64748B",
  },
  definitionText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#64748B",
  },
  notebookHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  notebookCard: {
    backgroundColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  recentSearchesTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagTextItem: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#334155",
    marginRight: 6,
  },
  tagClose: {
    marginLeft: 4,
  },
});
