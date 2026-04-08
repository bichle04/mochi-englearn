import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';

interface FlashcardButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

export const FlashcardButton: React.FC<FlashcardButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  loading = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.button, getButtonStyle(), style]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#55BA5D'} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#55BA5D',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryText: {
    color: '#000000',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#55BA5D',
  },
});
