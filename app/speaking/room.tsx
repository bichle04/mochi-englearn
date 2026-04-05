import { speakingService } from "@/services/speaking.service";
import { SpeakingQuestion } from "@/types/speaking";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import ScoringModal from "../../components/speaking/ScoringModal";
import { useAuth } from "../../contexts/AuthContext";

const BREAK_TIME = 10;
import { router, useLocalSearchParams } from "expo-router";
import { Pause, Volume2, X, ChevronRight, Play } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";

const { width } = Dimensions.get("window");

type RoomState =
  | "idle"           
  | "playing-audio"  
  | "break"          
  | "preparing"      
  | "recording"      
  | "finished";      

export default function SpeakingRoom() {
  const params = useLocalSearchParams();
  const mode = params.mode as "practice" | "test";
  const topicId = params.topicId as string;
  const { user } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [roomState, setRoomState] = useState<RoomState>("idle");
  const [prepTimeLeft, setPrepTimeLeft] = useState(0);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(0);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [apiFeedback, setApiFeedback] = useState<any>(null);
  const [isRecordingUnloaded, setIsRecordingUnloaded] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [scoringStatus, setScoringStatus] = useState<'analyzing' | 'success' | 'error'>('analyzing');

  const [questions, setQuestions] = useState<SpeakingQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      if (mode === "test") {
        const data = await speakingService.getFullTestQuestions();
        setQuestions(data);
      } else if (topicId) {
        const data = await speakingService.getSpeakingQuestions(topicId);
        setQuestions(data);
      }
      setIsLoading(false);
    }
    fetchQuestions();
  }, [mode, topicId]);

  const currentQuestion = questions[currentQuestionIndex] || {
    id: "",
    part: 1,
    question: "",
    prepTime: 0,
    speakTime: 0,
    audioUrl: "",
  };

  const progress = questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  useEffect(() => {
    return () => {
      Speech.stop();
      if (sound) sound.unloadAsync();
      if (recording && !isRecordingUnloaded) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, [sound, recording, isRecordingUnloaded]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (roomState === "break" && breakTimeLeft > 0) {
      interval = setInterval(() => {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            setRoomState("idle");
            setShowBreakModal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (roomState === "preparing" && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft((prev) => {
          if (prev <= 1) {
            startRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (roomState === "recording" && speakTimeLeft > 0) {
      interval = setInterval(() => {
        setSpeakTimeLeft((prev) => {
          if (prev <= 1) {
            const hasMoreQuestionsInSamePart =
              currentQuestionIndex < questions.length - 1 &&
              questions[currentQuestionIndex + 1]?.part === currentQuestion.part;

            if (hasMoreQuestionsInSamePart) {
              setRoomState("finished");
            } else {
              pauseRecording();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [roomState, prepTimeLeft, speakTimeLeft, breakTimeLeft, currentQuestionIndex, questions, currentQuestion.part]);

  const playAudio = async () => {
    try {
      if (recording) {
        const status = await recording.getStatusAsync();
        if (status.isRecording) await recording.pauseAsync();
      }

      setIsAudioPlaying(true);
      setRoomState("playing-audio");

      const textToSpeak = currentQuestion.question || "Please listen to the instructions.";

      Speech.speak(textToSpeak, {
        language: 'en-US',
        rate: 0.9,
        onDone: () => handleAudioFinished(),
        onStopped: () => setIsAudioPlaying(false),
        onError: (e) => {
          console.error("Speech error", e);
          handleAudioFinished();
        }
      });

    } catch (error) {
      console.error("Error playing audio:", error);
      handleAudioFinished();
    }
  };

  const handleAudioFinished = () => {
    setIsAudioPlaying(false);
    if (currentQuestion.part === 2 && currentQuestion.prepTime > 0) {
      setRoomState("preparing");
      setPrepTimeLeft(currentQuestion.prepTime);
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        if (recording) {
          const status = await recording.getStatusAsync();
          if (status.isRecording) {
            // keep going
          } else if (status.isDoneRecording) {
            const { recording: newRecording } = await Audio.Recording.createAsync(
              Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(newRecording);
          } else {
            await recording.startAsync();
          }
        } else {
          const { recording: newRecording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
          );
          setRecording(newRecording);
        }

        setRoomState("recording");
        setSpeakTimeLeft(currentQuestion.speakTime);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const pauseRecording = async () => {
    setRoomState("finished");
    if (!recording) return;
    try {
      await recording.pauseAsync();
    } catch (error) {
      console.error("Error pausing recording:", error);
    }
  };

  const saveRecording = async (isFinal: boolean = true) => {
    if (!recording) return null;
    try {
      await recording.stopAndUnloadAsync();
      setIsRecordingUnloaded(true);
      const uri = recording.getURI();

      if (uri) {
        let fileName = mode === "test" 
          ? `recording-full-test-${Date.now()}.m4a`
          : `recording-part-${currentQuestion.part}-${Date.now()}.m4a`;

        let newPath = uri;
        if (Platform.OS !== "web" && FileSystem.documentDirectory) {
          newPath = FileSystem.documentDirectory + fileName;
          await FileSystem.moveAsync({ from: uri, to: newPath });
        }

        let questionsForAPI = mode === "test"
          ? questions.map(q => q.question)
          : questions.filter(q => q.part === currentQuestion.part).map(q => q.question);

        try {
          setIsScoring(true);
          setScoringStatus('analyzing');
          
          /* 
            ========================================================================
            [START: BACKEND_INTEGRATION]
            Sau này khi bạn đã sẵn sàng xử lý API thật, hãy BỎ COMMENT đoạn code dưới đây 
            và XÓA phần MOCK_LOGIC bên dưới.
            ========================================================================
          */
          /*
          const feedback = await speakingService.submitSpeakingAudio(newPath, questionsForAPI);
          setApiFeedback(feedback);

          if (user?.id) {
            const firstQuestion = questions[0];
            const partId = firstQuestion?.topicId ? parseInt(firstQuestion.topicId) : 1;
            await speakingService.saveSpeakingFeedback(user.id, currentQuestion.part, partId, feedback);
          }

          if (isFinal) {
            setScoringStatus('success');
            await new Promise(resolve => setTimeout(resolve, 1500));
          }

          setIsScoring(false);
          return feedback;
          */
          // [END: BACKEND_INTEGRATION]

          /* 
            ========================================================================
            [START: MOCK_LOGIC] - Phần giả lập kết quả để phục vụ test UI
            Sau này hãy xóa khối code này khi bạn đã mở comment phần API thật ở trên.
            ========================================================================
          */
          await new Promise(resolve => setTimeout(resolve, 1500)); // Giả lập thời gian xử lý AI
          
          const mockFeedback = {
            overall_score: 6.0,
            transcript: "This is a simulated transcript for your IELTS speaking session.",
            details: {
              fluency: {
                score: 6.0,
                evaluation: [
                  { criteria: "Steady Pace", description: "The speaker maintains a steady pace and is able to convey the main message clearly." },
                  { criteria: "Coherence", description: "The speech lacks variety in sentence structure and complexity." }
                ],
                errors: [
                  { original: "this is the example how I can use this recorder", suggested: "this is an example of how I can use this recorder", explanation: "The phrase 'this is the example how' is awkward." }
                ],
                feedback: "The speaker demonstrates a basic level of fluency and coherence.",
                wpm: 116.96
              },
              pronunciation: {
                score: 6.0,
                evaluation: [{ criteria: "Intonation", description: "Generally clear but needs more precision." }],
                errors: [],
                feedback: "Practice word stress to enhance pronunciation clarity."
              },
              grammar: {
                score: 6.0,
                evaluation: [{ criteria: "Range", description: "Uses a wider range of sentence structures." }],
                errors: [
                  { original: "I has a dog since two years", suggested: "I have had a dog for two years", explanation: "Use the present perfect 'have had'." }
                ],
                feedback: "Focus on improving complex sentence formation."
              },
              vocabulary: {
                score: 5.0,
                evaluation: [{ criteria: "Lexical Range", description: "Show a wider range of vocabulary." }],
                errors: [],
                feedback: "Work on using more academic or complex vocabulary."
              }
            },
            general_suggestions: [
              "Work on using a wider range of sentence structures to improve coherence.",
              "Practice word stress to enhance pronunciation clarity."
            ]
          };

          setApiFeedback(mockFeedback);

          if (isFinal) {
            setScoringStatus('success');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          setIsScoring(false);
          return mockFeedback;
          // [END: MOCK_LOGIC]

        } catch (apiError) {
          setIsScoring(false);
          Alert.alert("API Error", "Failed to process recording.");
          return null;
        }
      }
      setRecording(null);
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];

      if (currentQuestion.part !== nextQuestion.part) {
        await pauseRecording();
        if (mode === "practice") await saveRecording(false);
        setCurrentQuestionIndex(nextIndex);
        setRoomState("break");
        setBreakTimeLeft(BREAK_TIME);
        setShowBreakModal(true);
      } else {
        setCurrentQuestionIndex(nextIndex);
        setRoomState("idle");
      }
      setPrepTimeLeft(0);
      setSpeakTimeLeft(0);
    } else {
      await pauseRecording();
      const recordingFeedback = await saveRecording(true);
      if (recordingFeedback) {
        router.push({
          pathname: "/speaking/result",
          params: { feedback: JSON.stringify(recordingFeedback) }
        } as any);
      } else {
        router.push("/speaking/result" as any);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getInstructionText = () => {
    switch (roomState) {
      case "idle": return "Press play to start";
      case "playing-audio": return "Playing the question";
      case "recording": return "Recording...";
      case "finished": return "Completed!";
      default: return "";
    }
  };

  if (isLoading) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#545454" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Part {currentQuestion.part} - {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Play/Pause Button */}
        <TouchableOpacity 
          style={styles.audioMainButton}
          onPress={playAudio}
          disabled={roomState !== "idle" && roomState !== "playing-audio"}
        >
          {roomState === "playing-audio" ? (
            <Pause size={48} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Volume2 size={48} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <Text style={styles.listenTitle}>Listen Carefully</Text>
        <Text style={styles.listenSubtitle}>
          The examiner will ask you{"\n"}questions
        </Text>

        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <Text style={styles.mascotImg}>🎙️</Text>
        </View>

        {/* Dynamic Cards */}
        <View style={styles.dynamicCardContainer}>
          {roomState === "recording" && (
            <View style={styles.timeRemainingCard}>
              <Text style={styles.blueTimerLabel}>Time remaining</Text>
              <Text style={styles.blueTimerValue}>{formatTime(speakTimeLeft)}</Text>
              <TouchableOpacity 
                style={styles.blueNextBtn}
                onPress={() => handleNextQuestion()}
              >
                <Text style={styles.blueNextBtnText}>Next</Text>
                <ChevronRight size={20} color="#FFFFFF" strokeWidth={3} />
              </TouchableOpacity>
            </View>
          )}

          {roomState === "finished" && (
            <View style={styles.completedCard}>
              <Text style={styles.greenCompletedLabel}>Completed!</Text>
              <Text style={styles.completedEmoji}>🎉</Text>
              <TouchableOpacity 
                style={styles.greenBtn}
                onPress={handleNextQuestion}
              >
                <Text style={styles.greenBtnText}>View results</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Status Section */}
      <View style={styles.bottomStatusContainer}>
        {roomState === "recording" ? (
          <View style={styles.recordingPill}>
            <View style={styles.redDot} />
            <Text style={styles.recordingPillText}>RECORDING...</Text>
          </View>
        ) : (
          <Text style={[
            styles.instructionText,
            roomState === "playing-audio" && { color: "#22C55E" }
          ]}>
            {getInstructionText()}
          </Text>
        )}
      </View>

      {/* Scoring Modal */}
      <ScoringModal visible={isScoring} status={scoringStatus} />

      {/* Break Modal */}
      <Modal visible={showBreakModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.breakCard}>
            <Text style={styles.breakEmoji}>☕</Text>
            <Text style={styles.breakTitle}>Break time</Text>
            <Text style={styles.breakTimer}>{formatTime(breakTimeLeft)}</Text>
            <Text style={styles.breakDesc}>Prepare for Part {currentQuestion.part}!</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 15 : 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#2E3A59",
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  audioMainButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    // Shadow
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  listenTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#1A2138",
    marginBottom: 8,
  },
  listenSubtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  mascotContainer: {
    marginBottom: 40,
  },
  mascotImg: {
    fontSize: 60,
  },
  dynamicCardContainer: {
    width: "100%",
    alignItems: "center",
  },
  timeRemainingCard: {
    width: "100%",
    backgroundColor: "#E2F2FD",
    borderRadius: 25,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0085E8",
  },
  blueTimerLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#0085E8",
    marginBottom: 10,
  },
  blueTimerValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 48,
    color: "#2E3A59",
    marginBottom: 20,
  },
  blueNextBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0085E8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
    gap: 8,
  },
  blueNextBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  completedCard: {
    width: "100%",
    backgroundColor: "#E3FFE5",
    borderRadius: 25,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#01BD50",
  },
  greenCompletedLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#01BD50",
    marginBottom: 15,
  },
  completedEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  greenBtn: {
    backgroundColor: "#01BD50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  greenBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  bottomStatusContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 40,
  },
  instructionText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#2E3A59",
  },
  recordingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
    gap: 10,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DC2626",
  },
  recordingPillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#DC2626",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  breakCard: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    borderRadius: 30,
    alignItems: "center",
    width: width * 0.8,
  },
  breakEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  breakTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 24,
    color: "#1A2138",
    marginBottom: 10,
  },
  breakTimer: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 48,
    color: "#FF6B9D",
    marginBottom: 10,
  },
  breakDesc: {
    fontFamily: "Nunito_400Regular",
    fontSize: 18,
    color: "#6B7280",
  },
});
