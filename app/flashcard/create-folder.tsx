import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { FolderIcon } from '@/components/flashcard/FolderIcon';

export default function CreateFolderScreen() {
  const [folderName, setFolderName] = useState('');

  const handleCreate = () => {
    if (folderName.trim()) {
      router.push({
        pathname: "/flashcard/[folderId]" as any,
        params: { folderId: folderName.trim() }
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.buttonCancel}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleCreate} 
              style={[styles.buttonCreate, !folderName && styles.buttonDisabled]}
              disabled={!folderName}
            >
              <Text style={styles.createText}>Tạo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <FolderIcon size={80} color="#55BA5D" />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                {!folderName && (
                  <View style={styles.placeholderOverlay} pointerEvents="none">
                    <Text style={styles.placeholderText}>Tên thư mục </Text>
                    <Text style={styles.asterisk}>*</Text>
                  </View>
                )}
                <TextInput
                  style={styles.input}
                  value={folderName}
                  onChangeText={setFolderName}
                  autoFocus
                  selectionColor="#55BA5D"
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed top part
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '92%', // Not full screen
    backgroundColor: '#FAF8F8',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonCancel: {
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    color: '#000',
  },
  buttonCreate: {
    padding: 10,
    backgroundColor: '#55BA5D',
    borderRadius: 25,
    paddingHorizontal: 25,
  },
  buttonDisabled: {
    backgroundColor: '#A0D8A5',
  },
  createText: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  iconContainer: {
    marginBottom: 40,
  },
  inputWrapper: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  inputContainer: {
    position: 'relative',
    height: 30,
    justifyContent: 'center',
  },
  placeholderOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  placeholderText: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: '#9B99A3',
  },
  asterisk: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: '#E65050',
  },
  input: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 16,
    color: '#000',
    padding: 0,
    zIndex: 2,
    height: '100%',
  },
});
