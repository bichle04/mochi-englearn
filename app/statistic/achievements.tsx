import React from 'react';
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
  Flame,
  Lock,
  Trophy,
  Gauge,
  Book,
  Mic,
  PenTool,
  Users,
  TrendingUp,
  Check,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const COLORS = {
  green: '#55BA5D',
  grayText: '#A1A1AA',
  grayBg: '#E4E4E7',
  white: '#FFFFFF',
};

const ACHIEVED_BADGES = [
  { id: 1, name: 'Vua từ vựng', subtitle: '500 từ mới', image: require('../../assets/images/statistic/achive1.png') },
  { id: 2, name: 'Chiến binh', subtitle: '30 ngày học', image: require('../../assets/images/statistic/achive2.png') },
  { id: 3, name: 'Bậc thầy', subtitle: 'Listening', image: require('../../assets/images/statistic/achive3.png') },
];

const HIDDEN_BADGES = [
  { id: 1, name: 'IELTS 8.0', subtitle: 'Thi thử đạt 8.0', icon: <Trophy size={28} color={COLORS.grayText} /> },
  { id: 2, name: 'Thần tốc', subtitle: 'Xong Reading < 15p', icon: <Gauge size={28} color={COLORS.grayText} /> },
  { id: 3, name: 'Mọt sách', subtitle: 'Đọc 100 bài báo', icon: <Book size={28} color={COLORS.grayText} /> },
  { id: 4, name: 'Diễn giả', subtitle: 'Nói 1 tiếng liên tục', icon: <Mic size={28} color={COLORS.grayText} /> },
  { id: 5, name: 'Bút vàng', subtitle: 'Writing Task 2 hoàn hảo', icon: <PenTool size={28} color={COLORS.grayText} /> },
  { id: 6, name: 'Người dẫn đầu', subtitle: 'Top 1 bảng tuần', icon: <Users size={28} color={COLORS.grayText} /> },
];

export default function AchievementsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thành tích</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Row */}
        <View style={styles.summaryContainer}>
          <View style={styles.summarySplit}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng huy hiệu</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>12</Text>
                <Text style={styles.summaryMax}> / 45</Text>
              </View>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Chuỗi học tập</Text>
              <View style={styles.summaryValueRow}>
                <Flame size={20} color={COLORS.green} style={{ marginRight: 6 }} />
                <Text style={[styles.summaryValue, { color: COLORS.green }]}>15 ngày</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achieved Badges */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Huy hiệu đã đạt được</Text>
          <TouchableOpacity style={styles.seeAllBadge}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.badgeGrid}>
          {ACHIEVED_BADGES.map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <View style={styles.badgeImageWrapper}>
                <Image source={badge.image} style={styles.badgeLargeImage} />
                <View style={styles.checkIcon}>
                  <Check size={12} color="#FFFFFF" strokeWidth={4} />
                </View>
              </View>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeSub}>{badge.subtitle}</Text>
            </View>
          ))}
        </View>

        {/* Hidden Badges */}
        <View style={[styles.sectionHeader]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>Huy hiệu còn ẩn</Text>
            <Lock size={18} color={COLORS.grayText} style={{ marginLeft: 8 }} />
          </View>
        </View>

        <View style={styles.hiddenGrid}>
          {HIDDEN_BADGES.map((badge) => (
            <View key={badge.id} style={styles.hiddenItem}>
              <View style={styles.hiddenIconContainer}>
                {badge.icon}
              </View>
              <Text style={styles.hiddenName}>{badge.name}</Text>
              <Text style={styles.hiddenSub}>{badge.subtitle}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Sticky Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Tiếp tục học tập</Text>
          <TrendingUp size={22} color="#FFFFFF" style={{ marginLeft: 10 }} />
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
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: 26,
    paddingHorizontal: 20,
    marginBottom: 20,
    // Very light shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  summarySplit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#F3F4F6',
  },
  summaryLabel: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 15,
    color: '#A1A1AA',
    marginBottom: 10,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 28,
    color: '#1F2937',
  },
  summaryMax: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 18,
    color: '#A1A1AA',
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 19,
    color: '#111827',
  },
  seeAllBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
  },
  seeAllText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: COLORS.green,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  badgeItem: {
    width: (width - 64) / 3,
    alignItems: 'center',
  },
  badgeImageWrapper: {
    width: 95,
    height: 95,
    marginBottom: 14,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLargeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeName: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 15,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeSub: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: COLORS.grayText,
    textAlign: 'center',
  },
  hiddenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hiddenItem: {
    width: (width - 64) / 3,
    alignItems: 'center',
    marginBottom: 24,
  },
  hiddenIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  hiddenName: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: COLORS.grayText,
    textAlign: 'center',
    marginBottom: 2,
  },
  hiddenSub: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 10,
    color: COLORS.grayText,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 4,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionButton: {
    backgroundColor: COLORS.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 40,
    // Shadow
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
