import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { FolderIcon } from '@/components/flashcard/FolderIcon';
import { FlashcardButton } from '@/components/flashcard/FlashcardButton';
import { 
  X, 
  MoreHorizontal, 
  Plus, 
  Search,
  MessagesSquare,
  Coffee
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { TextInput } from 'react-native';

const STUDY_MODULES_METADATA = [
  { id: '1', title: 'Tất cả', count: 100, icon: MessagesSquare, color: '#4CAF50', bgColor: '#F0FFF0' },
  { id: '2', title: 'Giao tiếp hàng ngày', count: 20, icon: MessagesSquare, color: '#FF9800', bgColor: '#FFF3E0' },
  { id: '3', title: '1500 từ vựng phổ biến', count: 20, icon: Coffee, color: '#2196F3', bgColor: '#E3F2FD' },
  { id: '4', title: '500+ TOEIC', count: 30, icon: MessagesSquare, color: '#FFD700', bgColor: '#FFFDE7' },
  { id: '5', title: '6.0 IELTS', count: 30, icon: MessagesSquare, color: '#9C27B0', bgColor: '#F3E5F5' },
  { id: '6', title: 'Giao tiếp cơ bản', count: 40, icon: MessagesSquare, color: '#E91E63', bgColor: '#FCE4EC' },
  { id: '7', title: 'IELTS Reading Skills', count: 25, icon: MessagesSquare, color: '#607D8B', bgColor: '#ECEFF1' },
  { id: '8', title: 'TOEFL Vocabulary', count: 50, icon: MessagesSquare, color: '#F44336', bgColor: '#FFEBEE' },
  { id: '9', title: 'English for Business', count: 35, icon: MessagesSquare, color: '#795548', bgColor: '#EFEBE9' },
];

export default function FolderDetailScreen() {
  const { folderId, addedCount, selectedIdsStr } = useLocalSearchParams<{ folderId: string, addedCount?: string, selectedIdsStr?: string }>();
  const folderName = typeof folderId === 'string' ? folderId : 'Thư mục mới';
  
  const [showToast, setShowToast] = useState(false);
  const [showStudyButton, setShowStudyButton] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Extract selected modules
  const selectedModules = selectedIdsStr 
    ? STUDY_MODULES_METADATA.filter(m => selectedIdsStr.split(',').includes(m.id))
    : STUDY_MODULES_METADATA.slice(1, 4); // Default to some modules if no selectedIds passed

  useEffect(() => {
    if (addedCount) {
      setShowToast(true);
      setShowStudyButton(false);
      const timer = setTimeout(() => {
        setShowToast(false);
        setShowStudyButton(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addedCount]);

  const handleClose = () => {
    router.back();
  };

  const handleSelectItem = () => {
    router.push({
      pathname: '/flashcard/select-module',
      params: { folderId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.iconButtonRound}>
          <X size={22} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerRightPill}>
          <TouchableOpacity style={styles.pillIconButton}>
            <MoreHorizontal size={22} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.pillIconButton} onPress={handleSelectItem}>
            <Plus size={22} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.folderHeader}>
          <FolderIcon size={80} color="#55BA5D" />
          <Text style={styles.folderName}>{folderName}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.inactiveTab]}>
             <Plus size={16} color="#000" />
            <Text style={styles.inactiveTabText}> Thẻ mới</Text>
          </TouchableOpacity>
        </View>

        {selectedModules.length > 0 ? (
          <View style={styles.listContainer}>
            <View style={styles.searchContainer}>
              <Search size={18} color="#9B99A3" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm"
                placeholderTextColor="#9B99A3"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View style={styles.modulesList}>
              {selectedModules.filter(m => m.title.toLowerCase().includes(searchText.toLowerCase())).map((module) => (
                <TouchableOpacity 
                  key={module.id} 
                  style={styles.moduleCard}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/flashcard/module/[moduleId]',
                    params: { moduleId: module.id, title: module.title }
                  })}
                >
                  <View style={[styles.moduleIconBox, { backgroundColor: module.bgColor }]}>
                    <module.icon size={24} color={module.color} />
                  </View>
                  <View style={styles.moduleTextContainer}>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    <Text style={styles.moduleCount}>{module.count} flashcard</Text>
                  </View>
                  <TouchableOpacity style={styles.moreVerticalButton}>
                    <MoreHorizontal size={20} color="#000" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyStateCard}>
            <Image 
              source={require('@/assets/images/flashcard/empty-illustration.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
            
            <Text style={styles.emptyStateText}>Bắt đầu xây dựng thư mục của bạn</Text>
            
            <FlashcardButton 
              title="Thêm tài liệu học" 
              onPress={handleSelectItem} 
              size="small"
              style={styles.addButton}
              textStyle={styles.addButtonText}
            />
          </View>
        )}
      </ScrollView>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>
            {addedCount} mục đã được thêm vào
          </Text>
          <Text style={styles.toastTextBold}>{folderName}</Text>
        </View>
      )}

      {/* Study All Button */}
      {showStudyButton && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.studyAllButton}>
            <Text style={styles.studyAllButtonText}>Học hết</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 30 : 44,
    paddingBottom: 16,
  },
  iconButtonRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 6,
    height: 40,
  },
  pillIconButton: {
    paddingHorizontal: 6,
    height: '100%' as any,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
  folderHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  folderName: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '90%',
    justifyContent: 'flex-start',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  activeTab: {
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: 'transparent',
  },
  activeTabText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 14,
    color: '#000',
  },
  inactiveTab: {
    backgroundColor: '#F3F3F3',
  },
  inactiveTabText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 14,
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#FFFFFF', // Changed to White as requested
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
    // Add subtle shadow for visibility on #FAF8F8
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'WorkSans_500Medium',
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
  },
  modulesList: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra space to not overlap footer
  },
  moduleCard: {
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
  moduleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleTextContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  moduleCount: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 12,
    color: '#9B99A3',
  },
  moreVerticalButton: {
    padding: 8,
  },
  emptyStateCard: {
    width: '90%',
    backgroundColor: '#F3F3F3',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 120,
    marginBottom: 20,
  },
  emptyStateText: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#55BA5D',
    borderRadius: 25,
    paddingHorizontal: 25,
  },
  addButtonText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 14,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#E8FAE6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  toastText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    color: '#55BA5D',
    marginBottom: 4,
  },
  toastTextBold: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    color: '#55BA5D',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  studyAllButton: {
    backgroundColor: '#55BA5D',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studyAllButtonText: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
