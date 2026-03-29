import { View, Text, StyleSheet } from 'react-native';

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Statistics (Sắp ra mắt)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },
  text: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 20,
    color: '#2C3E50'
  }
});
