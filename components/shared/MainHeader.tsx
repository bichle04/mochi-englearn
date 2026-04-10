import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame, Bell } from 'lucide-react-native';
import { useUserStats } from '@/hooks/useUserStats';

interface MainHeaderProps {
  title: string;
  onNotificationPress?: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ 
  title, 
  onNotificationPress 
}) => {
  const { stats } = useUserStats();
  const currentStreak = stats?.currentStreak || 0;

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerIcons}>
        <View style={styles.flameContainer}>
          <Flame size={20} color="#EA580C" fill="#EA580C" />
          <Text style={styles.flameText}>{currentStreak}</Text>
        </View>
        <TouchableOpacity onPress={onNotificationPress} activeOpacity={0.7}>
          <Bell size={24} color="#55BA5D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 26,
    color: "#0F172A",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  flameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  flameText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#EA580C",
    marginLeft: 4,
  },
});

export default MainHeader;
