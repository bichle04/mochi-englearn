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

const SENTENCE_DATA = [
  {
    section: "MEETING POINT",
    sentences: [
      {
        id: 1,
        before: "The tour starts at the",
        after: "Square near the main entrance.",
      },
    ],
  },
  {
    section: "MAIN LIBRARY FEATURES",
    sentences: [
      {
        id: 2,
        before: "Open 24 hours during the",
        after: "period.",
      },
      {
        id: 3,
        before: "Level 4 is designated for",
        after: "study only.",
      },
    ],
  },
  {
    section: "STUDENT UNION SERVICES",
    sentences: [
      {
        id: 4,
        before: "The first floor houses a new",
        after: "for student relaxation.",
      },
      {
        id: 5,
        before: "Students can collect their",
        after: "cards here from Monday.",
      },
    ],
  },
];

export default function SentenceQuizScreen() {
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
        { text: "Nộp bài", onPress: () => router.back() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Reusing quiz UI */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sentence completion</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Top Info Area (Grey Background Part) - Reusing quiz UI */}
        <View style={styles.topSection}>
          <View style={styles.topInfoRow}>
            <Text style={styles.partLabel}>Part 1</Text>
            <View style={styles.timerContainer}>
              <Clock size={16} color="#55BA5D" />
              <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
            </View>
          </View>

          {/* Custom Audio Player - Reusing quiz UI */}
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

        {/* Content Card (White Background Part) */}
        <View style={styles.contentCard}>
          <Text style={styles.cardMainTitle}>Notes on a Campus Tour</Text>

          {SENTENCE_DATA.map((section, sIndex) => (
            <View key={sIndex} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
              
              {section.sentences.map((sentence) => (
                <View key={sentence.id} style={styles.sentenceWrapper}>
                  <View style={styles.bulletPoint} />
                  <View style={styles.textContainer}>
                    <Text style={styles.sentenceText}>
                      {sentence.before}{" "}
                      <View style={styles.inlineInputWrapper}>
                        <TextInput
                          style={styles.inlineInput}
                          placeholder={`${sentence.id}`}
                          placeholderTextColor="#9CA3AF"
                          value={answers[sentence.id] || ""}
                          onChangeText={(text) => handleInputChange(sentence.id, text)}
                          textAlign="center"
                        />
                      </View>
                      {" "}{sentence.after}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Footer - Reusing quiz UI */}
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
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 24,
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 20,
    letterSpacing: 1,
  },
  sentenceWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#55BA5D",
    marginTop: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  sentenceText: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 28,
  },
  inlineInputWrapper: {
    backgroundColor: "#F3F4F6",
    borderRadius: 15,
    width: 70,
    height: 32,
    justifyContent: "center",
    marginHorizontal: 4,
    top: 6,
  },
  inlineInput: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 15,
    color: "#1F2937",
    padding: 0,
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
