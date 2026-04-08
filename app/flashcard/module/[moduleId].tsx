import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Dimensions,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { 
  X, 
  MoreHorizontal, 
  Plus, 
  Coffee,
  PenLine,
  Trash2,
  Image as ImageIcon,
  GraduationCap,
  MessagesSquare,
  Trophy,
  Languages,
  BookOpen,
  Briefcase
} from 'lucide-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Extended mockdata >= 30
const INITIAL_MOCK_DATA = Array.from({ length: 35 }).map((_, index) => {
  const words = [
    { en: 'Cloud', vi: 'Mây' },
    { en: 'Apple', vi: 'Quả táo' },
    { en: 'Earth', vi: 'Trái đất' },
    { en: 'Water', vi: 'Nước' },
    { en: 'Fire', vi: 'Lửa' },
    { en: 'Wind', vi: 'Gió' },
    { en: 'Mountain', vi: 'Ngọn núi' },
    { en: 'River', vi: 'Dòng sông' },
    { en: 'Tree', vi: 'Cây' },
    { en: 'Flower', vi: 'Hoa' }
  ];
  const word = words[index % words.length];
  return {
    id: `item-${index}`,
    en: word.en,
    vi: word.vi,
  };
});

const MODULE_ICONS: Record<string, { Icon: any, color: string, bgColor: string }> = {
  'Tất cả': { Icon: ImageIcon, color: '#4CAF50', bgColor: '#F0FFF0' },
  'Giao tiếp hàng ngày': { Icon: MessagesSquare, color: '#FF9800', bgColor: '#FFF3E0' },
  '1500 từ vựng phổ biến': { Icon: Coffee, color: '#2196F3', bgColor: '#E3F2FD' },
  '500+ TOEIC': { Icon: Trophy, color: '#FFD700', bgColor: '#FFFDE7' },
  '6.0 IELTS': { Icon: GraduationCap, color: '#9C27B0', bgColor: '#F3E5F5' },
  'Giao tiếp cơ bản': { Icon: Languages, color: '#E91E63', bgColor: '#FCE4EC' },
  'IELTS Reading Skills': { Icon: BookOpen, color: '#607D8B', bgColor: '#ECEFF1' },
  'TOEFL Vocabulary': { Icon: Trophy, color: '#F44336', bgColor: '#FFEBEE' },
  'English for Business': { Icon: Briefcase, color: '#795548', bgColor: '#EFEBE9' }
};

export default function ModuleDetailScreen() {
  const router = useRouter();
  const { title = "1500 từ vựng phổ biến" } = useLocalSearchParams<{title: string}>();
  
  const iconConfig = MODULE_ICONS[title] || MODULE_ICONS['1500 từ vựng phổ biến'];
  const ModuleIcon = iconConfig.Icon;

  const [words, setWords] = useState(INITIAL_MOCK_DATA);
  
  // Edit State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<{id: string, en: string, vi: string} | null>(null);
  
  // Delete State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{id: string, en: string, vi: string} | null>(null);

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (editingItem) {
      setWords(prev => prev.map(w => w.id === editingItem.id ? editingItem : w));
      setEditModalVisible(false);
      setEditingItem(null);
    }
  };

  const openDeleteModal = (item: any) => {
    setDeletingItem(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      setWords(prev => prev.filter(w => w.id !== deletingItem.id));
      setDeleteModalVisible(false);
      setDeletingItem(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButtonRound} onPress={() => router.back()}>
          <X size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerRightPill}>
          <TouchableOpacity style={styles.pillIconButton}>
            <MoreHorizontal size={22} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.pillIconButton}>
            <Plus size={22} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Module Info */}
      <View style={styles.moduleInfo}>
        <View style={[styles.moduleIconBox, { backgroundColor: iconConfig.bgColor }]}>
          <ModuleIcon size={40} color={iconConfig.color} strokeWidth={1.5} />
        </View>
        <Text style={styles.moduleTitle}>{title}</Text>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {words.map((item) => (
          <View key={item.id} style={styles.wordCard}>
            <View style={styles.wordTextContainer}>
              <Text style={styles.wordEn}>{item.en}</Text>
              <Text style={styles.wordVi}>{item.vi}</Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <PenLine size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openDeleteModal(item)} style={styles.actionButton}>
                <Trash2 size={20} color="#FE8080" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {/* Bottom padding for floating button */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Study All Button - Hide when any modal is visible so it won't peek through */}
      {(!editModalVisible && !deleteModalVisible) && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.studyAllButton}>
            <Text style={styles.studyAllText}>Học hết</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Modal */}
      <Modal transparent visible={editModalVisible} animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setEditModalVisible(false)} 
          />
          <View style={styles.editModalContainer}>
            <View style={styles.handleBar} />
            <Text style={styles.modalTitle}>Sửa flashcards</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.inputField}
                  value={editingItem?.en || ''}
                  onChangeText={(text) => editingItem && setEditingItem({...editingItem, en: text})}
                  placeholder="Tiếng Anh"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.inputField}
                  value={editingItem?.vi || ''}
                  onChangeText={(text) => editingItem && setEditingItem({...editingItem, vi: text})}
                  placeholder="Tiếng Việt"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
              <Text style={styles.saveButtonText}>Lưu lại</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Modal */}
      <Modal transparent visible={deleteModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setDeleteModalVisible(false)} 
          />
          <View style={styles.deleteModalContainer}>
            <View style={styles.handleBar} />
            
            <Image 
              source={require('../../../assets/images/flashcard/deleteFlashcard.png')} 
              style={styles.deleteIllustration}
              resizeMode="contain"
            />
            
            <Text style={styles.modalTitle}>Xoá flashcards</Text>
            <Text style={styles.deleteDescription}>
              <Text style={styles.deleteTargetWord}>{deletingItem?.en}</Text> sẽ bị xoá vĩnh viễn khỏi chủ đề <Text style={styles.deleteTargetTopic}>"{title}"</Text>
            </Text>

            <TouchableOpacity style={styles.deleteConfirmButton} onPress={confirmDelete}>
              <Text style={styles.deleteConfirmText}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moduleIconBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  wordTextContainer: {
    flex: 1,
  },
  wordEn: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  wordVi: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 12,
    color: '#696674',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: 'transparent',
  },
  studyAllButton: {
    backgroundColor: '#34d399', // Based on image 1 green color
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  studyAllText: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  editModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 0,
    paddingTop: 12,
    alignItems: 'center',
  },
  deleteModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 0,
    paddingTop: 12,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
    backgroundColor: 'rgba(85, 186, 93, 0.2)', // #55BA5D opacity 20%
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  inputField: {
    fontFamily: 'WorkSans_500Medium',
    fontSize: 14,
    color: '#5C5966',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#34d399',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  saveButtonText: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  deleteIllustration: {
    width: 250,
    height: 250,
    marginBottom: 0,
  },
  deleteDescription: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  deleteTargetWord: {
    color: '#4B5563',
  },
  deleteTargetTopic: {
    color: '#34d399', // Green
    fontFamily: 'WorkSans_600SemiBold',
  },
  deleteConfirmButton: {
    width: '100%',
    backgroundColor: '#E65050',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  deleteConfirmText: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  }
});
