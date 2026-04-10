import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  Play,
  Pause,
  Volume2,
} from "lucide-react-native";
import { RestartLinear } from "@solar-icons/react-native";

const { width } = Dimensions.get("window");

const MOCK_QUESTIONS = [
  { id: 1, label: "GUEST NAME", placeholder: "Enter name" },
  { id: 2, label: "CHECK-IN DATE", placeholder: "Enter date" },
  { id: 3, label: "ROOM TYPE", placeholder: "Enter room type" },
  { id: 4, label: "LENGTH OF STAY", placeholder: "3 Nights", isReadOnly: true },
  { id: 5, label: "SPECIAL REQUESTS", placeholder: "Additional requirements..." },
  { id: 6, label: "CONTACT PHONE NUMBER", placeholder: "Enter number" },
  { id: 7, label: "NUMBER OF GUESTS", placeholder: "Enter number" },
  { id: 8, label: "BREAKFAST OPTION", placeholder: "Additional requirements..." },
  { id: 9, label: "ESTIMATED ARRIVAL TIME", placeholder: "Enter time" },
  { id: 10, label: "PAYMENT METHOD", placeholder: "Enter method" },
  { id: 11, label: "EMAIL ADDRESS", placeholder: "Enter email" },
];

export default function ListeningQuizScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // Audio Logic
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0); 
  const audioDuration = 192; // 3:12 in seconds

  // Timer Logic
  const [timerSeconds, setTimerSeconds] = useState(1485); // Start at 24:45

  // Effect for Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Effect for Audio Player Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioTime((prev) => (prev < audioDuration ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = (audioTime / audioDuration) * 100;

  const handleInputChange = (id: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  // Logic: Can submit if at least one question is filled
  const answeredCount = Object.values(answers).filter(val => val.trim().length > 0).length;
  const canSubmit = answeredCount > 0;

  const handleReplay10 = () => {
    setAudioTime((prev) => (prev > 10 ? prev - 10 : 0));
  };

  // Logic like Reading section: Confirm exit
  const handleBack = () => {
    Alert.alert(
      "Thoát bài thi?",
      "Tiến trình làm bài của bạn sẽ không được lưu. Bạn có chắc chắn muốn thoát không?",
      [
        { text: "Tiếp tục làm", style: "cancel" },
        { text: "Thoát", style: "destructive", onPress: () => router.back() }
      ]
    );
  };

  // Logic like Reading section: Confirm submit
  const handleSubmit = () => {
    Alert.alert(
      "Nộp bài",
      "Bạn có chắc chắn muốn nộp bài không?",
      [
        { text: "Nhìn lại", style: "cancel" },
        { 
          text: "Nộp bài", 
          onPress: () => {
            // Simplified for now, just going back as per UI request
            router.back();
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Form/ table/ note completion</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.topSection}>
          <View style={styles.topInfoRow}>
            <Text style={styles.partLabel}>Part 1</Text>
            <View style={styles.timerContainer}>
              <Clock size={16} color="#55BA5D" />
              <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
            </View>
          </View>

          <View style={styles.playerContainer}>
            <TouchableOpacity 
              style={styles.playButton} 
              activeOpacity={0.8}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause size={24} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                <View style={[styles.progressThumb, { left: `${progressPercent}%` }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(audioTime)}</Text>
                <Text style={styles.timeText}>{formatTime(audioDuration)}</Text>
              </View>
            </View>

            <View style={styles.playerActions}>
              <TouchableOpacity>
                <Volume2 size={22} color="#4B5563" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ marginLeft: 16, alignItems: 'center', justifyContent: 'center' }}
                onPress={handleReplay10}
                activeOpacity={0.7}
              >
                <View style={styles.replayIconWrapper}>
                  <View style={{ transform: [{ scaleX: -1 }] }}>
                    <RestartLinear size={24} color="#4B5563" />
                  </View>
                  <Text style={styles.replayText}>10s</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.cardMainTitle}>Hotel Reservation Form</Text>
          <Text style={styles.cardSubtitle}>Customer Inquiry Reference: #8821-XP</Text>

          {MOCK_QUESTIONS.map((item) => (
            <View key={item.id} style={styles.questionContainer}>
              <Text style={styles.fieldLabel}>{item.label}</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.questionNumber}>[{item.id}]</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={item.placeholder}
                  placeholderTextColor="#9CA3AF"
                  value={answers[item.id] || (item.isReadOnly ? item.placeholder : "")}
                  onChangeText={(text) => handleInputChange(item.id, text)}
                  editable={!item.isReadOnly}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton, 
            canSubmit ? styles.submitButtonActive : styles.submitButtonInactive
          ]}
          activeOpacity={0.8}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Nộp bài</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    padding: 5,
    marginLeft: -5,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#2D3436",
    flex: 1,
    marginLeft: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F9FAFB",
  },
  topSection: {
    backgroundColor: "#F9FAFB",
    paddingBottom: 20,
  },
  topInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 20,
  },
  partLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
    color: "#000000",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  timerText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: "#2D3436",
    marginLeft: 6,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#55BA5D",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarWrapper: {
    flex: 1,
    marginHorizontal: 15,
    paddingTop: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: "#55BA5D",
    borderRadius: 2,
  },
  progressThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#55BA5D",
    position: 'absolute',
    top: -5,
    marginLeft: -7,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 10,
    color: "#9CA3AF",
  },
  playerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  replayIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayText: {
    fontSize: 8,
    fontFamily: "WorkSans_700Bold",
    color: "#4B5563",
    marginTop: -2,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 45,
    paddingHorizontal: 25,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 10,
  },
  cardMainTitle: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 24,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 40,
  },
  questionContainer: {
    marginBottom: 28,
  },
  fieldLabel: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 10,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 52,
  },
  questionNumber: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 16,
    color: "#55BA5D",
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: "WorkSans_400Regular",
    fontSize: 16,
    color: "#111827",
  },
  footer: {
    paddingHorizontal: 25,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 10,
  },
  submitButton: {
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonInactive: {
    backgroundColor: "#CBD5E1",
  },
  submitButtonActive: {
    backgroundColor: "#55BA5D",
  },
  submitButtonText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
