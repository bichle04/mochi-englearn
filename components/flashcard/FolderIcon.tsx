import React from 'react';
import { View } from 'react-native';
import { Folder } from 'lucide-react-native';

interface FolderIconProps {
  size?: number;
  color?: string;
  fill?: boolean;
}

export const FolderIcon: React.FC<FolderIconProps> = ({ 
  size = 64, 
  color = '#55BA5D',
  fill = false
}) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Folder 
        size={size} 
        color={color} 
        strokeWidth={1.5}
        fill={fill ? color : "none"}
      />
    </View>
  );
};
