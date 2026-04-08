import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, MoreVertical, Volume2, PlayCircle } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
// Import SafeAreaView from react-native-safe-area-context
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusinessCourseScreen() {
  const router = useRouter();

  const vocabularyList = [
    {
      word: 'Revenue',
      level: 'C1',
      pronunciation: "/'rev.ə.nu:/",
      definition: 'Tổng số tiền mà một doanh nghiệp nhận được từ các hoạt động kinh doanh.',
    },
    {
      word: 'Liquidity',
      level: 'C1',
      pronunciation: "/lɪ'kwɪd.ə.ti/",
      definition: 'Khả năng chuyển đổi tài sản thành tiền mặt một cách nhanh chóng.',
    },
    {
      word: 'Assets',
      level: 'C1',
      pronunciation: "/'æs.et/",
      definition: 'Các nguồn lực có giá trị kinh tế mà một cá nhân hoặc doanh nghiệp sở hữu.',
    },
    {
      word: 'Liability',
      level: 'C1',
      pronunciation: "/,laɪ.ə'bɪl.ə.ti/",
      definition: 'Các khoản nợ hoặc nghĩa vụ tài chính của doanh nghiệp phát sinh trong quá trình hoạt động.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft size={24} color="#55BA5D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Từ vựng về kinh doanh</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MoreVertical size={24} color="#55BA5D" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Danh sách từ vựng</Text>
          <Text style={styles.listSubtitle}>{vocabularyList.length} từ trong bài này</Text>
        </View>

        <View style={styles.cardsContainer}>
          {vocabularyList.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.wordInfo}>
                  <View style={styles.wordTitleRow}>
                    <Text style={styles.wordText}>{item.word}</Text>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>{item.level}</Text>
                    </View>
                  </View>
                  <Text style={styles.pronunciationText}>{item.pronunciation}</Text>
                </View>
                <TouchableOpacity style={styles.audioButton}>
                  <Volume2 size={20} color="#55BA5D" />
                </TouchableOpacity>
              </View>
              <Text style={styles.definitionText}>
                <Text style={styles.definitionLabel}>Nghĩa: </Text>
                {item.definition}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() => router.push('/course/lesson')}
        >
          <Text style={styles.startButtonText}>Bắt đầu học</Text>
          <PlayCircle size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#55BA5D',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 110, // accommodate bottom button
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  listTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#1A202C',
  },
  listSubtitle: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 13,
    color: '#718096',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wordInfo: {
    flex: 1,
  },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  wordText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: '#1A202C',
  },
  levelBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 12,
    color: '#55BA5D',
  },
  pronunciationText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: '#718096',
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  definitionText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 15,
    color: '#2D3748',
    lineHeight: 22,
  },
  definitionLabel: {
    fontFamily: 'Lexend_700Bold',
    color: '#55BA5D',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FAFAFA',
  },
  startButton: {
    backgroundColor: '#55BA5D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    shadowColor: '#55BA5D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
