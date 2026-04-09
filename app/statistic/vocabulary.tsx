import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Monitor,
  Leaf,
  Briefcase,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = {
  green: '#55BA5D',
  red: '#EF4444',
  yellow: '#FACC15',
  purple: '#A855F7',
  gray: '#9CA3AF',
  lightGray: '#F3F4F6',
};

const VOCAB_TYPES = [
  { label: 'Đã thuộc', count: '750 từ', color: COLORS.green },
  { label: 'Đang học', count: '375 từ', color: COLORS.yellow },
  { label: 'Từ khó', count: '125 từ', color: COLORS.red },
];

const TOPICS = [
  { id: 1, name: 'Education', percent: 80, color: COLORS.green, icon: <GraduationCap size={22} color={COLORS.green} /> },
  { id: 2, name: 'Technology', percent: 45, color: COLORS.yellow, icon: <Monitor size={22} color={COLORS.yellow} /> },
  { id: 3, name: 'Environment', percent: 20, color: COLORS.green, icon: <Leaf size={22} color={COLORS.green} /> },
  { id: 4, name: 'Work & Career', percent: 10, color: COLORS.red, icon: <Briefcase size={22} color={COLORS.red} /> },
];

export default function VocabularyStatisticsScreen() {
  const router = useRouter();

  // Donut Chart logic
  const size = 180;
  const strokeWidth = 35;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Percentages for segments (mocked to match image visual)
  const greenPercent = 0.55;
  const yellowPercent = 0.3;
  const redPercent = 0.15;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê Từ vựng</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng số từ đã học</Text>
          <View style={styles.summaryValueRow}>
            <Text style={styles.summaryValue}>1,250</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>+15% tuần này</Text>
            </View>
          </View>
        </View>

        {/* Classification Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Phân loại từ vựng</Text>
          
          <View style={styles.donutRow}>
            {/* Donut Chart */}
            <View style={styles.chartWrapper}>
              <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size/2}, ${size/2}`}>
                  {/* Green Segment */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={COLORS.green}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference * greenPercent} ${circumference}`}
                    fill="transparent"
                  />
                  {/* Yellow Segment */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={COLORS.yellow}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference * yellowPercent} ${circumference}`}
                    strokeDashoffset={-circumference * greenPercent}
                    fill="transparent"
                  />
                  {/* Red Segment */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={COLORS.red}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference * redPercent} ${circumference}`}
                    strokeDashoffset={-circumference * (greenPercent + yellowPercent)}
                    fill="transparent"
                  />
                </G>
                {/* Center Text */}
                <View style={[styles.chartCenterText, { top: size/2 - 25, left: size/2 - 40 }]}>
                  <Text style={styles.percentText}>75%</Text>
                  <Text style={styles.completeLabel}>Hoàn thành</Text>
                </View>
              </Svg>
            </View>

            {/* Legend */}
            <View style={styles.legendWrapper}>
              {VOCAB_TYPES.map((type, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: type.color }]} />
                  <View>
                    <Text style={styles.legendLabel}>{type.label}</Text>
                    <Text style={styles.legendCount}>{type.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Topics Section */}
        <View style={styles.topicsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chủ đề IELTS phổ biến</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {TOPICS.map((topic) => (
            <View key={topic.id} style={styles.topicCard}>
              <View style={styles.topicIconContainer}>
                {topic.icon}
              </View>
              <View style={styles.topicInfo}>
                <View style={styles.topicHeaderRow}>
                  <Text style={styles.topicName}>{topic.name}</Text>
                  <Text style={[styles.topicPercent, { color: topic.color }]}>
                    {topic.percent}%
                  </Text>
                </View>
                {/* Custom Progress Bar */}
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${topic.percent}%`, backgroundColor: topic.color }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Action Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={styles.learnButton}
          activeOpacity={0.8}
        >
          <BookOpen size={24} color="#FFFFFF" />
          <Text style={styles.learnButtonText}>Tiếp tục học ngay</Text>
        </TouchableOpacity>
      </View>
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
  summaryCard: {
    backgroundColor: COLORS.green,
    borderRadius: 40,
    padding: 30,
    marginBottom: 24,
    // Soft shadow
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  summaryLabel: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 16,
    color: '#E8F5E9',
    marginBottom: 8,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 42,
    color: '#FFFFFF',
    marginRight: 16,
  },
  trendBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 32,
    // Very light shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 20,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  chartWrapper: {
    position: 'relative',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: {
    position: 'absolute',
    alignItems: 'center',
    width: 80,
  },
  percentText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 24,
    color: COLORS.green,
  },
  completeLabel: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 10,
    color: COLORS.gray,
    textAlign: 'center',
  },
  legendWrapper: {
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendLabel: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 12,
    color: COLORS.gray,
  },
  legendCount: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#1F2937',
  },
  topicsSection: {
    marginBottom: 24,
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
    color: COLORS.green,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Light shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  topicIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicInfo: {
    flex: 1,
  },
  topicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicName: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 15,
    color: '#1F2937',
  },
  topicPercent: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 13,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  learnButton: {
    backgroundColor: COLORS.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    // Button shadow
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight transparency
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  learnButtonText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 17,
    color: '#FFFFFF',
    marginLeft: 12,
  },
});
