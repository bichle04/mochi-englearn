import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Platform,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  Search, 
  Plus, 
  Image as ImageIcon, 
  MessagesSquare, 
  Coffee, 
  Trophy, 
  GraduationCap,
  BookOpen,
  Languages,
  Briefcase
} from 'lucide-react-native';
import { StudyModuleItem } from '@/components/flashcard/StudyModuleItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const STUDY_MODULES = [
  { id: '1', title: 'Tất cả', count: 100, icon: ImageIcon, color: '#4CAF50', bgColor: '#F0FFF0' },
  { id: '2', title: 'Giao tiếp hàng ngày', count: 20, icon: MessagesSquare, color: '#FF9800', bgColor: '#FFF3E0' },
  { id: '3', title: '1500 từ vựng phổ biến', count: 20, icon: Coffee, color: '#2196F3', bgColor: '#E3F2FD' },
  { id: '4', title: '500+ TOEIC', count: 30, icon: Trophy, color: '#FFD700', bgColor: '#FFFDE7' },
  { id: '5', title: '6.0 IELTS', count: 30, icon: GraduationCap, color: '#9C27B0', bgColor: '#F3E5F5' },
  { id: '6', title: 'Giao tiếp cơ bản', count: 40, icon: Languages, color: '#E91E63', bgColor: '#FCE4EC' },
  { id: '7', title: 'IELTS Reading Skills', count: 25, icon: BookOpen, color: '#607D8B', bgColor: '#ECEFF1' },
  { id: '8', title: 'TOEFL Vocabulary', count: 50, icon: Trophy, color: '#F44336', bgColor: '#FFEBEE' },
  { id: '9', title: 'English for Business', count: 35, icon: Briefcase, color: '#795548', bgColor: '#EFEBE9' },
];

export default function SelectItemScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: string }>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only trigger if dragging down
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          // Swipe down enough to dismiss
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => router.back());
        } else {
          // Reset if not enough swipe
          Animated.spring(translateY, {
            toValue: 0,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleBack = () => {
    router.back();
  };

  const toggleSelection = (id: string) => {
    if (id === '1') { // 'Tất cả' item
      if (selectedIds.length === STUDY_MODULES.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(STUDY_MODULES.map(m => m.id));
      }
    } else {
      setSelectedIds(prev => {
        const newSelection = prev.includes(id) 
          ? prev.filter(i => i !== id) 
          : [...prev, id];
        
        // If all other items are selected, add 'Tất cả' (id '1')
        const otherItems = STUDY_MODULES.filter(m => m.id !== '1');
        const allOthersSelected = otherItems.every(m => newSelection.includes(m.id));
        
        if (allOthersSelected && !newSelection.includes('1')) {
          return [...newSelection, '1'];
        } else if (!allOthersSelected && newSelection.includes('1')) {
          return newSelection.filter(i => i !== '1');
        }
        
        return newSelection;
      });
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length > 0) {
      router.replace({
        pathname: `/flashcard/${folderId}` as any,
        params: { 
          addedCount: selectedIds.length,
          selectedIdsStr: selectedIds.join(',')
        }
      });
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.dismissOverlay} 
        onPress={handleBack} 
        activeOpacity={1} 
      />
      <Animated.View 
        style={[
          styles.modalContainer,
          { transform: [{ translateY }] }
        ]}
      >
        <View {...panResponder.panHandlers}>
          {/* Top Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Lựa chọn học phần</Text>
            
            <View style={styles.searchContainer}>
              <Search size={18} color="#696674" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm"
                placeholderTextColor="#696674"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {STUDY_MODULES.filter(m => m.title.toLowerCase().includes(searchText.toLowerCase())).map((module) => (
            <StudyModuleItem
              key={module.id}
              title={module.title}
              count={module.count}
              icon={module.icon}
              iconColor={module.color}
              iconBgColor={module.bgColor}
              isSelected={selectedIds.includes(module.id)}
              onPress={() => toggleSelection(module.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.createButton}>
            <Plus size={20} color="#55BA5D" />
            <Text style={styles.createButtonText}>Tạo thư mục</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.confirmButton, selectedIds.length === 0 && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={selectedIds.length === 0}
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    height: '92%', // Matching Create Folder exactly
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: '#D9D9D9',
    borderRadius: 3,
  },
  dragArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 28,
    color: '#1A1C3E',
    marginBottom: 30, 
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F8',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'WorkSans_500Medium',
    fontSize: 14,
    color: '#696674',
    marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 160,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8FAE6',
    borderRadius: 30,
    height: 56,
    marginRight: 12,
  },
  createButtonText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    color: '#55BA5D',
    marginLeft: 6,
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#55BA5D',
    borderRadius: 30,
    height: 56,
  },
  confirmButtonDisabled: {
    backgroundColor: '#A0D8A5',
  },
  confirmButtonText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
