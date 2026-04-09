import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  SquarePen,
  Mic,
  ChevronDown,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const COLORS = {
  green: '#55BA5D',
  orange: '#F97316',
  blue: '#3B82F6',
  purple: '#A855F7',
  bgGreen: '#E1FFE4',
  bgOrange: '#FFF7ED',
  bgBlue: '#EFF6FF',
  bgPurple: '#F5F3FF',
};

const FILTERS = ['Tất cả', 'Reading', 'Listening', 'Writing', 'Speaking'];

const HISTORY_DATA = [
  {
    id: 1,
    type: 'Reading',
    title: 'Reading: Matching Headings',
    subtitle: 'Hôm nay • 20 phút',
    score: '8.5',
    color: COLORS.green,
    bgColor: COLORS.bgGreen,
    icon: <BookOpen size={24} color={COLORS.green} />,
  },
  {
    id: 2,
    type: 'Listening',
    title: 'Listening: Section 3 Practice',
    subtitle: 'Hôm qua • 35 phút',
    score: '7.0',
    color: COLORS.orange,
    bgColor: COLORS.bgOrange,
    icon: <Headphones size={24} color={COLORS.orange} />,
  },
  {
    id: 3,
    type: 'Writing',
    title: 'Writing Task 1: Bar Chart',
    subtitle: '22/05/2024 • 25 phút',
    score: '7.5',
    color: COLORS.blue,
    bgColor: COLORS.bgBlue,
    icon: <SquarePen size={24} color={COLORS.blue} />,
  },
  {
    id: 4,
    type: 'Speaking',
    title: 'Speaking Part 2: Travel',
    subtitle: '20/05/2024 • 15 phút',
    score: '8.0',
    color: COLORS.purple,
    bgColor: COLORS.bgPurple,
    icon: <Mic size={24} color={COLORS.purple} />,
  },
  {
    id: 5,
    type: 'Reading',
    title: 'Reading: True/False/Not Given',
    subtitle: '18/05/2024 • 22 phút',
    score: '6.5',
    color: COLORS.green,
    bgColor: COLORS.bgGreen,
    icon: <BookOpen size={24} color={COLORS.green} />,
  },
];

export default function StudyHistoryScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      
      {/* Fixed Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử học tập</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.summaryLabel}>Điểm trung bình</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>7.5</Text>
              <Text style={styles.scoreChange}>+0.5</Text>
            </View>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.green }]}>
            <Text style={[styles.summaryLabel, { color: '#FFFFFF' }]}>Đã hoàn thành</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreValue, { color: '#FFFFFF' }]}>24</Text>
              <Text style={[styles.unitText, { color: '#FFFFFF' }]}>bài</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.activeFilterTab,
              ]}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List Section */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Gần đây</Text>
          
          {HISTORY_DATA.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyItem}>
              <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                {item.icon}
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.badgeText}>{item.score}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Link */}
        <TouchableOpacity style={styles.footerLink}>
          <Text style={styles.footerText}>Xem thêm lịch sử</Text>
          <ChevronDown size={20} color={COLORS.green} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: '#111827',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: (width - 48) / 2,
    padding: 20,
    borderRadius: 40,
    justifyContent: 'center',
  },
  summaryLabel: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: COLORS.green,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 28,
    color: '#111827',
  },
  scoreChange: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: COLORS.green,
    marginLeft: 8,
  },
  unitText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 16,
    color: '#111827',
    marginLeft: 6,
  },
  filterScroll: {
    marginBottom: 24,
    marginHorizontal: -16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterTab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterTab: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
    // iOS shadow
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
  },
  filterText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    // Android shadow
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  itemSubtitle: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  scoreBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: 8,
  },
  footerText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 15,
    color: COLORS.green,
    marginRight: 8,
  },
});
