import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PenLine, Trash2 } from 'lucide-react-native';

interface FlashcardWordItemProps {
  en: string;
  vi: string;
  onEdit?: () => void;
  onDelete?: () => void;
  hideActions?: boolean;
}

export const FlashcardWordItem: React.FC<FlashcardWordItemProps> = ({ 
  en, 
  vi, 
  onEdit, 
  onDelete,
  hideActions = false
}) => {
  return (
    <View style={styles.wordCard}>
      <View style={styles.wordTextContainer}>
        <Text style={styles.wordEn}>{en}</Text>
        <Text style={styles.wordVi}>{vi}</Text>
      </View>
      {!hideActions && (
        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <PenLine size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Trash2 size={20} color="#FE8080" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
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
});
