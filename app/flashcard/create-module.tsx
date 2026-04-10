import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { router, Stack } from 'expo-router';
import { 
  X, 
  GraduationCap, 
  Coffee, 
  Trophy, 
  Languages, 
  BookOpen, 
  Briefcase, 
  Image as ImageIcon,
  Plus
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ICONS = [
  { id: 'grad', Icon: GraduationCap, color: '#9C27B0' },
  { id: 'coffee', Icon: Coffee, color: '#2196F3' },
  { id: 'trophy', Icon: Trophy, color: '#FFD700' },
  { id: 'lang', Icon: Languages, color: '#E91E63' },
  { id: 'book', Icon: BookOpen, color: '#607D8B' },
  { id: 'brief', Icon: Briefcase, color: '#795548' },
  { id: 'image', Icon: ImageIcon, color: '#4CAF50' },
];

const COLORS = [
  '#A855F7', // Purple
  '#60A5FA', // Blue
  '#FACC15', // Yellow
  '#C084FC', // Light Purple
  '#22C55E', // Green
  '#E5E7EB', // Gray
];

interface FlashcardInput {
  word: string;
  definition: string;
}

export default function CreateModuleScreen() {
  const [step, setStep] = useState(1);
  const [moduleName, setModuleName] = useState('');
  const [selectedIconId, setSelectedIconId] = useState(ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  // Step 2 State
  const [flashcards, setFlashcards] = useState<FlashcardInput[]>([{ word: '', definition: '' }]);

  const handleCancel = () => {
    router.back();
  };

  const handleNextStep = () => {
    if (moduleName.trim()) {
      setStep(2);
    }
  };

  const addFlashcard = () => {
    setFlashcards([...flashcards, { word: '', definition: '' }]);
  };

  const updateFlashcard = (index: number, field: keyof FlashcardInput, value: string) => {
    const updated = [...flashcards];
    updated[index][field] = value;
    setFlashcards(updated);
  };

  const handleSave = () => {
    // Format the flashcards for the module detail page
    const dataToPass = flashcards.filter(f => f.word.trim() || f.definition.trim()).map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      en: f.word || 'Untitled',
      vi: f.definition || 'Chưa có định nghĩa',
      phonetic: '/.../' // Placeholder since phonetic isn't entered during creation
    }));

    router.push({
      pathname: '/flashcard/module/[moduleId]',
      params: { 
        moduleId: 'new-module', 
        title: moduleName || 'Học phần mới',
        initialData: JSON.stringify(dataToPass),
        fromCreate: 'true'
      }
    });
  };

  const SelectedIconComp = ICONS.find(i => i.id === selectedIconId)?.Icon || GraduationCap;
  const SelectedIconColor = ICONS.find(i => i.id === selectedIconId)?.color || '#000';

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.backdrop} 
            activeOpacity={1} 
            onPress={handleCancel} 
          />
          
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <View style={styles.handleBar} />
              
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Tạo học phần</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                  <Text style={styles.label}>Tên học phần</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={moduleName}
                      onChangeText={setModuleName}
                      placeholder="Tên học phần*"
                      placeholderTextColor="#9B99A3"
                      selectionColor="#55BA5D"
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Chọn Icon</Text>
                  <View style={styles.iconGrid}>
                    {ICONS.map((item) => (
                      <TouchableOpacity 
                        key={item.id}
                        style={[
                          styles.iconItem, 
                          { backgroundColor: selectedIconId === item.id ? selectedColor + '40' : '#F3F4F6' },
                          selectedIconId === item.id && { borderColor: selectedColor, borderWidth: 2 }
                        ]}
                        onPress={() => setSelectedIconId(item.id)}
                      >
                        <item.Icon size={32} color={selectedIconId === item.id ? selectedColor : '#9CA3AF'} strokeWidth={1.5} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Chọn màu</Text>
                  <View style={styles.colorRow}>
                    {COLORS.map((color) => (
                      <TouchableOpacity 
                        key={color}
                        style={[
                          styles.colorItem, 
                          { backgroundColor: color },
                          selectedColor === color && styles.colorItemSelected
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.buttonSection}>
                  <TouchableOpacity 
                    style={[styles.createButton, !moduleName.trim() && styles.createButtonDisabled]}
                    onPress={handleNextStep}
                    disabled={!moduleName.trim()}
                  >
                    <Text style={styles.createButtonText}>Tạo Học Phần</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Huỷ</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    );
  }

  // STEP 2: Add Items
  return (
    <View style={[styles.container, { backgroundColor: '#FAF8F8' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Step 2 */}
        <View style={styles.headerStep2}>
          <TouchableOpacity onPress={() => setStep(1)} style={styles.backButtonCircle}>
             <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitleStep2}>Tạo học phần</Text>
          <View style={{ width: 44 }} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentStep2}>
          {/* Icon and Name Display */}
          <View style={styles.modulePreviewContainer}>
            <View style={[styles.previewIconBox, { backgroundColor: selectedColor + '20' }]}>
               <SelectedIconComp size={40} color={selectedColor} strokeWidth={1.5} />
            </View>
            <View style={styles.moduleNameBadge}>
              <Text style={styles.moduleTitleText}>{moduleName || 'Học phần mới'}</Text>
            </View>
            <View style={styles.greenDivider} />
          </View>

          {/* Vocabulary Cards */}
          {flashcards.map((card, index) => (
            <View key={index} style={styles.vocabCard}>
              <View style={styles.vocabInputBox}>
                <TextInput
                  style={styles.vocabInput}
                  placeholder="Từ vựng"
                  placeholderTextColor="#9CA3AF"
                  value={card.word}
                  onChangeText={(val) => updateFlashcard(index, 'word', val)}
                />
              </View>
              <View style={styles.vocabInputBox}>
                <TextInput
                  style={[styles.vocabInput, { color: '#9B99A3' }]}
                  placeholder="Nghĩa"
                  placeholderTextColor="#9CA3AF"
                  value={card.definition}
                  onChangeText={(val) => updateFlashcard(index, 'definition', val)}
                />
              </View>
            </View>
          ))}
          
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* FAB + */}
        <TouchableOpacity style={styles.fabPlus} onPress={addFlashcard} activeOpacity={0.8}>
          <Plus size={32} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Save Button */}
        <View style={styles.footerStep2}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Lưu lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// Reuse some safe area components
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    height: '92%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 12,
  },
  keyboardView: {
    flex: 1,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  headerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: '#111827',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  input: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 16,
    color: '#111827',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconItem: {
    width: (width - 48 - 48) / 4,
    height: (width - 48 - 48) / 4,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 15,
  },
  colorItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorItemSelected: {
    borderColor: '#F3F4F6',
    transform: [{ scale: 1.1 }],
  },
  buttonSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  createButton: {
    width: '100%',
    backgroundColor: '#55BA5D',
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#55BA5D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  createButtonDisabled: {
    backgroundColor: '#A0D8A5',
    elevation: 0,
    shadowOpacity: 0,
  },
  createButtonText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 16,
    color: '#64748B',
  },

  // STEP 2 STYLES
  headerStep2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitleStep2: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 20,
    color: '#1F244B', // Dark purple-ish color from image
  },
  scrollContentStep2: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modulePreviewContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  previewIconBox: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  moduleNameBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  moduleTitleText: {
    fontFamily: 'WorkSans_500Medium',
    fontSize: 14,
    color: '#000000',
  },
  greenDivider: {
    height: 4,
    backgroundColor: '#55BA5D',
    width: '100%',
    borderRadius: 2,
  },
  vocabCard: {
    width: '100%',
    backgroundColor: 'rgba(85, 186, 93, 0.2)', // 20% opacity green
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  vocabInputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  vocabInput: {
    fontFamily: 'WorkSans_500Medium',
    fontSize: 14,
    color: '#000000',
  },
  fabPlus: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  footerStep2: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  saveBtn: {
    backgroundColor: '#22C55E',
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
