import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Flame,
  BookOpen,
  Languages,
  Clock,
  Trophy,
  ChevronRight,
  TrendingUp,
  Headphones,
  SquarePen,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const STAT_COLORS = {
  flame: '#F97316',
  lesson: '#3B82F6',
  vocab: '#55BA5D',
  time: '#A855F7',
  chart: '#55BA5D',
};

const CHART_DATA = [
  { day: 'T 2', value: 40, max: 80 },
  { day: 'T 3', value: 70, max: 100 },
  { day: 'T 4', value: 50, max: 90 },
  { day: 'T 5', value: 80, max: 110 },
  { day: 'T 6', value: 100, max: 120 },
  { day: 'T 7', value: 30, max: 70 },
  { day: 'CN', value: 10, max: 50 },
];

const ACHIEVEMENTS = [
  { id: 1, name: 'Vua từ vựng', image: require('../assets/images/statistic/achive1.png'), bg: '#E1FFE4' },
  { id: 2, name: 'Kiên trì', image: require('../assets/images/statistic/achive2.png'), bg: '#FFF7ED' },
  { id: 3, name: 'Bậc thầy', image: require('../assets/images/statistic/achive3.png'), bg: '#EFF6FF' },
  { id: 4, name: 'Siêu cấp', image: require('../assets/images/statistic/achive4.png'), bg: '#FEF9C3' },
];

const HISTORY = [
  {
    id: 1,
    title: 'Reading Practice',
    time: '2 giờ trước',
    score: '8.0 IELTS',
    icon: <BookOpen size={20} color="#3B82F6" />,
    iconBg: '#EFF6FF',
  },
  {
    id: 2,
    title: 'Listening Test #4',
    time: 'Hôm qua',
    score: '7.5 IELTS',
    icon: <Headphones size={20} color="#F97316" />,
    iconBg: '#FFF7ED',
  },
  {
    id: 3,
    title: 'IELTS Writing Task 1',
    time: '2 ngày trước',
    score: '6.5 IELTS',
    icon: <SquarePen size={20} color="#A855F7" />,
    iconBg: '#F5F3FF',
  },
];

export default function StatisticsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Overview Section (Not Sticky) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tổng quan tiến độ</Text>
          <View style={styles.statsGrid}>
            <View style={styles.gridRow}>
              <StatCard 
                icon={<Flame size={20} color={STAT_COLORS.flame} />}
                value="15 Ngày"
                label="CHUỖI"
              />
              <StatCard 
                icon={<BookOpen size={20} color={STAT_COLORS.lesson} />}
                value="450"
                label="BÀI HỌC"
              />
            </View>
            <View style={styles.gridRow}>
              <TouchableOpacity 
                activeOpacity={0.7}
                style={{ flex: 1 }}
                onPress={() => router.push('/statistic/vocabulary')}
              >
                <StatCard 
                  icon={<Languages size={20} color={STAT_COLORS.vocab} />}
                  value="1,200"
                  label="TỪ VỰNG"
                />
              </TouchableOpacity>
              <StatCard 
                icon={<Clock size={20} color={STAT_COLORS.time} />}
                value="45h"
                label="THỜI GIAN"
              />
            </View>
          </View>
        </View>

        {/* Daily Activity Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Hoạt động hàng ngày</Text>
            <Text style={styles.chartSubtitle}>Tuần này</Text>
          </View>
          <View style={styles.chartContainer}>
            {CHART_DATA.map((item, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.barFill, 
                      { height: `${(item.value / 120) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Achievements */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleSmall}>Thành tích gần đây</Text>
            <TouchableOpacity onPress={() => router.push('/statistic/achievements')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScrollContent}>
            {ACHIEVEMENTS.map((ach) => (
              <View key={ach.id} style={styles.badgeItem}>
                <View style={[styles.badgeContainer, { backgroundColor: ach.bg }]}>
                  <Image source={ach.image} style={styles.badgeImage} />
                </View>
                <Text style={styles.badgeName}>{ach.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Lesson History */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleSmall}>Lịch sử bài học</Text>
            <TouchableOpacity onPress={() => router.push('/statistic/history')}>
              <Text style={styles.seeMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {HISTORY.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyCard}>
              <View style={[styles.historyIconContainer, { backgroundColor: item.iconBg }]}>
                {item.icon}
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyTime}>{item.time}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{item.score}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Encouragement Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIconContainer}>
            <Trophy size={20} color="#FFFFFF" />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Tiếp tục phát huy!</Text>
            <Text style={styles.bannerSubtitle}>
              Bạn chỉ còn 50 từ nữa để đạt mốc 1,250 từ vựng.
            </Text>
          </View>
        </View>
        
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconWrapper}>
        {icon}
      </View>
      <View style={styles.statTextWrapper}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 22,
    color: '#111827',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 20,
  },
  sectionTitleSmall: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#111827',
  },
  statsGrid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 80, // Very rounded cards
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Very light shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  statIconWrapper: {
    marginBottom: 4,
  },
  statTextWrapper: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 0,
  },
  statLabel: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 11,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#111827',
  },
  chartSubtitle: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: '#55BA5D',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 240,
    // Very light shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 3,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    width: 40, // Much wider bars
    height: 140,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#55BA5D',
    borderRadius: 20,
  },
  dayLabel: {
    marginTop: 10,
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  achievementsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: '#55BA5D',
  },
  seeMoreText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: '#55BA5D',
  },
  badgeScrollContent: {
    gap: 12,
  },
  badgeItem: {
    alignItems: 'center',
    width: 95,
  },
  badgeContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeImage: {
    width: 68,
    height: 68,
    resizeMode: 'contain',
  },
  badgeName: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 11,
    color: '#4B5563',
    textAlign: 'center',
  },
  historySection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 45, // Pill shape
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Very light shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  historyIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: '#1F2937',
  },
  historyTime: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  scoreText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 12,
    color: '#22C55E',
  },
  banner: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: '#F0FDF4',
    borderRadius: 60,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  bannerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#55BA5D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: '#55BA5D',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
});



