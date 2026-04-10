import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Flame, 
  Search, 
  Grid, 
  List as ListIcon, 
  Plus, 
  X, 
  Folder, 
  Image as ImageIcon, 
  GraduationCap, 
  MessagesSquare, 
  Coffee, 
  FileText,
  ArrowRight,
  Trophy,
  Languages,
  BookOpen,
  Briefcase
} from 'lucide-react-native';
import { router, useNavigation, Stack } from 'expo-router';

const { width } = Dimensions.get('window');

const GRID_ITEMS = [
  {
    title: 'Tất cả',
    subtitle: '100 học phần',
    iconColor: '#4CAF50',
    iconBgColor: '#F0FFF0',
    titleColor: '#4CAF50',
    subtitleColor: '#86EFAC',
    Icon: ImageIcon,
  },
  {
    title: 'Giao tiếp hàng ngày', // Removed \n for list format
    subtitle: '10 flashcard',
    iconColor: '#FF9800',
    iconBgColor: '#FFF3E0',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: MessagesSquare,
  },
  {
    title: '1500 từ vựng phổ biến',
    subtitle: '20 flashcard',
    iconColor: '#2196F3',
    iconBgColor: '#E3F2FD',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: Coffee,
  },
  {
    title: '500+ TOEIC',
    subtitle: '30 flashcard',
    iconColor: '#FFD700',
    iconBgColor: '#FFFDE7',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: Trophy,
  },
  {
    title: '6.0 IELTS',
    subtitle: '30 flashcard',
    iconColor: '#9C27B0',
    iconBgColor: '#F3E5F5',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: GraduationCap,
  },
  {
    title: 'Giao tiếp cơ bản',
    subtitle: '40 flashcard',
    iconColor: '#E91E63',
    iconBgColor: '#FCE4EC',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: Languages,
  },
  {
    title: 'IELTS Reading Skills',
    subtitle: '25 flashcard',
    iconColor: '#607D8B',
    iconBgColor: '#ECEFF1',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: BookOpen,
  },
  {
    title: 'TOEFL Vocabulary',
    subtitle: '50 flashcard',
    iconColor: '#F44336',
    iconBgColor: '#FFEBEE',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: Trophy,
  },
  {
    title: 'English for Business',
    subtitle: '35 flashcard',
    iconColor: '#795548',
    iconBgColor: '#EFEBE9',
    titleColor: '#374151',
    subtitleColor: '#9CA3AF',
    Icon: Briefcase,
  }
];

const FOLDER_MOCK_DATA = [
  { id: '1', title: '20 từ vựng mỗi ngày', count: 3 },
  { id: '2', title: 'Học từ vựng mỗi ngày', count: 3 },
  { id: '3', title: 'Luyện từ vựng mỗi ngày', count: 3 },
];

export default function NotebookScreen() {
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'folder' | 'module'>('all');
  const navigation = useNavigation();

  // Format title for grid vs list (adding \n for grid visual wrapping)
  const formatTitle = (title: string, isGrid: boolean) => {
    if (!isGrid) return title;
    if (title === 'Giao tiếp hàng ngày') return 'Giao tiếp\nhàng ngày';
    if (title === '1500 từ vựng phổ biến') return '1500 từ vựng\nphổ biến';
    if (title === 'Giao tiếp cơ bản') return 'Giao tiếp\ncơ bản';
    if (title === 'IELTS Reading Skills') return 'IELTS Reading\nSkills';
    if (title === 'TOEFL Vocabulary') return 'TOEFL\nVocabulary';
    if (title === 'English for Business') return 'English for\nBusiness';
    return title;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* STICKY HEADER AREA */}
      <View style={styles.stickyArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sổ Tay Của Tôi</Text>
          <View style={styles.flameContainer}>
            <Flame size={20} color="#EA580C" />
            <Text style={styles.flameText}>5</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Tab Pills */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={activeTab === 'all' ? styles.tabButtonTextActive : styles.tabButtonText}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'folder' && styles.tabButtonActive]}
              onPress={() => setActiveTab('folder')}
            >
              <Text style={activeTab === 'folder' ? styles.tabButtonTextActive : styles.tabButtonText}>Thư mục</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'module' && styles.tabButtonActive]}
              onPress={() => setActiveTab('module')}
            >
              <Text style={activeTab === 'module' ? styles.tabButtonTextActive : styles.tabButtonText}>Học phần</Text>
            </TouchableOpacity>
            
            {/* View Toggle - only relevant if 'all' view is selected but we keep it for match UI */}
            {activeTab === 'all' && (
              <View style={styles.viewToggleGroup}>
                <TouchableOpacity style={styles.viewToggleBtnActive}>
                  <Grid size={16} color="#55B95D" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewToggleBtn}>
                  <ListIcon size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* SCROLLABLE AREA */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'all' && (
          <>
            {/* Continue Learning Card */}
            <View style={styles.continueCard}>
              <View style={styles.continueCardLeft}>
                <View style={styles.recentLabel}>
                  <Text style={styles.recentLabelText}>• THẺ GẦN ĐÂY</Text>
                </View>
                <Text style={styles.continueTitle}>Tiếp Tục Học</Text>
                <Text style={styles.continueSubtitle}>Thẻ "Giao tiếp cơ bản"</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.nextWordText}>Từ tiếp theo: <Text style={styles.nextWordBold}>Sarcastic</Text></Text>
                    <Text style={styles.progressCountText}>14/40 thẻ</Text>
                  </View>
                  <View style={styles.progressBarWrapper}>
                    <View style={[styles.progressBarFill, { width: '35%' }]} />
                  </View>
                </View>

                <TouchableOpacity style={styles.continueButton}>
                  <Text style={styles.continueButtonText}>Tiếp tục ngay</Text>
                  <ArrowRight size={16} color="#80BD91" style={{marginLeft: 4}} />
                </TouchableOpacity>
              </View>
              <View style={styles.continueCardRight}>
                 <Image 
                   source={require('../../assets/images/flashcard/image.png')} 
                   style={styles.rightCardImage} 
                   resizeMode="contain"
                 />
              </View>
            </View>

            {/* Grid Items */}
            <View style={styles.gridContainer}>
              {GRID_ITEMS.map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.gridCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (item.title !== 'Tất cả') {
                      router.push({
                        pathname: '/flashcard/module/[moduleId]',
                        params: { moduleId: idx.toString(), title: item.title.replace('\n', ' ') }
                      });
                    }
                  }}
                >
                  <Text style={[styles.gridTitle, { color: item.titleColor }]}>{formatTitle(item.title, true)}</Text>
                  <Text style={[styles.gridSubtitle, { color: item.subtitleColor }]}>{item.subtitle}</Text>
                  <View style={[styles.gridIconContainer, { backgroundColor: item.iconBgColor }]}>
                    <item.Icon size={40} color={item.iconColor} strokeWidth={1.5} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeTab === 'module' && (
          <View style={styles.listContainer}>
            {/* Sort/organize to somewhat match Image 1's display (IELTS, Giao tiếp, 1500, Giao tiếp cơ bản...) */}
            {[GRID_ITEMS[4], GRID_ITEMS[1], GRID_ITEMS[2], GRID_ITEMS[5], GRID_ITEMS[2], GRID_ITEMS[5]].map((item, idx) => (
              <TouchableOpacity 
                key={`module-${idx}`} 
                style={styles.listItemCard}
                activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    pathname: '/flashcard/module/[moduleId]',
                    params: { moduleId: `list-${idx}`, title: item.title.replace('\n', ' ') }
                  });
                }}
              >
                <View style={[styles.listItemIconBox, { backgroundColor: item.iconBgColor }]}>
                  <item.Icon size={24} color={item.iconColor} />
                </View>
                <View style={styles.listItemTextContainer}>
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                  <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'folder' && (
          <View style={styles.listContainer}>
            {FOLDER_MOCK_DATA.map((folder, idx) => (
              <TouchableOpacity 
                key={`folder-${idx}`} 
                style={styles.listItemCard}
                activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    pathname: '/flashcard/[folderId]',
                    params: { folderId: folder.title }
                  });
                }}
              >
                <View style={styles.listFolderIconBox}>
                  <Folder size={24} color="#55B95D" strokeWidth={1.5} />
                </View>
                <View style={styles.listItemTextContainer}>
                  <Text style={styles.listItemTitle}>{folder.title}</Text>
                  <Text style={styles.listItemSubtitle}>{folder.count} học phần</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Bottom Padding for FAB */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* FAB and Overlay Menu */}
      {showFABMenu && (
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.overlayTouchable} 
            activeOpacity={1} 
            onPress={() => setShowFABMenu(false)}
          />
          <View style={styles.fabMenuContainer}>
            <View style={styles.fabMenuItem}>
              <TouchableOpacity 
                style={styles.fabMenuButton}
                onPress={() => {
                  setShowFABMenu(false);
                  router.push('/flashcard/create-folder');
                }}
              >
                <Folder size={24} color="#55B95D" fill="#55B95D" />
              </TouchableOpacity>
              <Text style={styles.fabMenuText}>Thư mục</Text>
            </View>

            <View style={styles.fabMenuItem}>
              <TouchableOpacity 
                style={styles.fabMenuButton}
                onPress={() => {
                  setShowFABMenu(false);
                  router.push('/flashcard/create-module');
                }}
              >
                <FileText size={24} color="#55B95D" fill="#55B95D" />
              </TouchableOpacity>
              <Text style={styles.fabMenuText}>Học phần</Text>
            </View>
          </View>
        </View>
      )}

      {/* Main FAB */}
      <TouchableOpacity 
        style={[styles.mainFab, showFABMenu ? styles.mainFabActive : {}]}
        onPress={() => setShowFABMenu(!showFABMenu)}
        activeOpacity={0.8}
      >
        {showFABMenu ? (
          <X size={28} color="#55B95D" />
        ) : (
          <Plus size={28} color="#FFFFFF" />
        )}
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  stickyArea: {
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 35,
    paddingBottom: 25,
  },
  headerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: '#111827',
  },
  flameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: '#EA580C',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: '#111827',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabsScrollContent: {
    alignItems: 'center',
    paddingRight: 10,
  },
  tabButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#55B95D',
  },
  tabButtonText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: '#4B5563',
  },
  tabButtonTextActive: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 3,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center'
  },
  viewToggleBtnActive: {
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    padding: 8,
  },
  viewToggleBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  continueCard: {
    backgroundColor: '#55B95D',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#55B95D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  continueCardLeft: {
    flex: 1,
  },
  recentLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  recentLabelText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  continueTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueSubtitle: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nextWordText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
  },
  nextWordBold: {
    fontFamily: 'Lexend_700Bold',
  },
  progressCountText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  progressBarWrapper: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 12,
    color: '#80BD91',
  },
  continueCardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  rightCardImage: {
    width: 90,
    height: 100,
    opacity: 0.9
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  gridCard: {
    width: (width - 55) / 2, // 40 is horizontal padding, 15 is gap
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  gridTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22,
  },
  gridSubtitle: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
  },
  gridIconContainer: {
    marginTop: 'auto',
    alignSelf: 'flex-end',
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: 5,
  },
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  listItemIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listFolderIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F3F4F6', // Light gray background for folder icon box matches Image 2
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100,
  },
  overlayTouchable: {
    flex: 1,
  },
  fabMenuContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 90,
    right: 25,
    alignItems: 'center',
  },
  fabMenuItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fabMenuButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabMenuText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  mainFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#55B95D',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#55B95D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 101,
  },
  mainFabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 6,
  }
});
