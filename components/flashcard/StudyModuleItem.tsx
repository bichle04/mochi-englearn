import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StudyModuleItemProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  onPress?: () => void;
  isSelected?: boolean;
}

export function StudyModuleItem({ 
  title, 
  count, 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  onPress,
  isSelected 
}: StudyModuleItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
        <Icon size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{count} flashcard</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: '#55BA5D',
    borderWidth: 1.5,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  count: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 12,
    color: '#9B99A3',
  },
});
