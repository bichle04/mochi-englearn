import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  X, 
  ChevronLeft, 
  RotateCcw, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  Brain,
  MoreVertical,
  Volume2,
  Maximize,
  Sliders,
  CheckCheck
} from 'lucide-react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { FlashcardWordItem } from '../../../components/flashcard/FlashcardWordItem';

const { width } = Dimensions.get('window');

interface Word {
  id: string;
  en: string;
  vi: string;
  phonetic: string;
}

interface MatchItem {
  id: string;
  text: string;
  originalId: string;
  type: 'en' | 'vi';
  matched: boolean;
}

type StudyStep = 'OVERVIEW' | 'STUDY' | 'RESULT';

export default function StudyScreen() {
  const router = useRouter();
  const { title, initialData } = useLocalSearchParams<{ title: string; initialData: string }>();
  
  const words: Word[] = useMemo(() => {
    if (initialData) {
      try {
        return JSON.parse(initialData);
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [initialData]);

  const [step, setStep] = useState<StudyStep>('OVERVIEW');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Stats
  const [learnedCount, setLearnedCount] = useState(0);
  const [notLearnedCount, setNotLearnedCount] = useState(0);

  // Modal & Mode State
  const [modeModalVisible, setModeModalVisible] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState('basic');

  // Quiz State
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Card Orientation (Basic Mode)
  const [isFlipped, setIsFlipped] = useState(false);

  // Match State
  const [matchItems, setMatchItems] = useState<MatchItem[]>([]);
  const [selectedMatchIndices, setSelectedMatchIndices] = useState<number[]>([]);
  const [matchBatchIndex, setMatchBatchIndex] = useState(0);
  const [mismatchedIndices, setMismatchedIndices] = useState<number[]>([]);
  const [missedIds, setMissedIds] = useState<Set<string>>(new Set());
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  const totalCards = words.length;

  const generateQuizOptions = (idx: number) => {
    if (words.length === 0) return [];
    const correct = words[idx].vi;
    const others = words.filter((_, i) => i !== idx).map(w => w.vi);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
  };

  const generateMatchBatch = (batchIdx: number) => {
    const start = batchIdx * 5;
    const batchWords = words.slice(start, start + 5);
    let items: MatchItem[] = [];
    batchWords.forEach(w => {
      items.push({ id: `en-${w.id}`, text: w.en, originalId: w.id, type: 'en', matched: false });
      items.push({ id: `vi-${w.id}`, text: w.vi, originalId: w.id, type: 'vi', matched: false });
    });
    return items.sort(() => Math.random() - 0.5);
  };

  const handleNext = (remembered: boolean) => {
    if (remembered) {
      setLearnedCount(prev => prev + 1);
    } else {
      setNotLearnedCount(prev => prev + 1);
    }

    if (currentIndex < totalCards - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (selectedModeId === 'quiz') {
        setQuizOptions(generateQuizOptions(nextIdx));
        setSelectedAnswerIndex(null);
        setIsAnswered(false);
      }
      setIsFlipped(false);
    } else {
      setStep('RESULT');
    }
  };

  const resetStudy = () => {
    setCurrentIndex(0);
    setLearnedCount(0);
    setNotLearnedCount(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setIsFlipped(false);
    setMatchBatchIndex(0);
    setMissedIds(new Set());
    setProcessedIds(new Set());
    if (selectedModeId === 'quiz') {
      setQuizOptions(generateQuizOptions(0));
    } else if (selectedModeId === 'match') {
      setMatchItems(generateMatchBatch(0));
    }
    setStep('STUDY');
  };

  const handleConfirmMode = () => {
    setModeModalVisible(false);
    setCurrentIndex(0);
    setLearnedCount(0);
    setNotLearnedCount(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setIsFlipped(false);
    setMatchBatchIndex(0);
    setMissedIds(new Set());
    setProcessedIds(new Set());
    
    if (selectedModeId === 'quiz') {
      setQuizOptions(generateQuizOptions(0));
    } else if (selectedModeId === 'match') {
      setMatchItems(generateMatchBatch(0));
    }
    setStep('STUDY');
  };

  const handleMatchSelection = (idx: number) => {
    if (matchItems[idx].matched || mismatchedIndices.length > 0) return;
    if (selectedMatchIndices.includes(idx)) {
      setSelectedMatchIndices(prev => prev.filter(i => i !== idx));
      return;
    }

    const newIndices = [...selectedMatchIndices, idx];
    setSelectedMatchIndices(newIndices);

    if (newIndices.length === 2) {
      const first = matchItems[newIndices[0]];
      const second = matchItems[newIndices[1]];

      if (first.originalId === second.originalId && first.type !== second.type) {
        // Correct
        setTimeout(() => {
          setMatchItems(prev => prev.map((item, i) => 
            newIndices.includes(i) ? { ...item, matched: true } : item
          ));
          setSelectedMatchIndices([]);

          // Update stats only once per originalId
          if (!processedIds.has(first.originalId)) {
            if (!missedIds.has(first.originalId)) {
              setLearnedCount(prev => prev + 1);
            }
            setProcessedIds(prev => new Set(prev).add(first.originalId));
          }
        }, 300);
      } else {
        // Wrong
        setMismatchedIndices(newIndices);
        
        // Mark both words as missed for stats
        setMissedIds(prev => {
          const next = new Set(prev);
          if (!processedIds.has(first.originalId)) {
              if (!next.has(first.originalId)) {
                setNotLearnedCount(c => c + 1);
                next.add(first.originalId);
              }
          }
          if (!processedIds.has(second.originalId)) {
              if (!next.has(second.originalId)) {
                setNotLearnedCount(c => c + 1);
                next.add(second.originalId);
              }
          }
          return next;
        });

        setTimeout(() => {
          setSelectedMatchIndices([]);
          setMismatchedIndices([]);
        }, 1000);
      }
    }
  };

  // Check if current match batch is finished
  useEffect(() => {
    if (selectedModeId === 'match' && matchItems.length > 0 && matchItems.every(i => i.matched)) {
      setTimeout(() => {
        const nextBatch = matchBatchIndex + 1;
        if (nextBatch * 5 < totalCards) {
          setMatchBatchIndex(nextBatch);
          setMatchItems(generateMatchBatch(nextBatch));
        } else {
          setStep('RESULT');
        }
      }, 500); // Small delay to let user see the last match
    }
  }, [matchItems]);

  const handleQuizSelection = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedAnswerIndex(optIdx);
    setIsAnswered(true);
    const isCorrect = quizOptions[optIdx] === words[currentIndex].vi;
    if (isCorrect) {
      setLearnedCount(prev => prev + 1);
    } else {
      setNotLearnedCount(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentIndex < totalCards - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setQuizOptions(generateQuizOptions(nextIdx));
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      setIsFlipped(false);
    } else {
      setStep('RESULT');
    }
  };

  const renderModeModal = () => {
    const modes = [
      { id: 'basic', title: 'Cơ bản', desc: 'Dạng bài dựa trên kiến thức cơ bản để các bạn học tập.' },
      { id: 'quiz', title: 'Chọn đáp án đúng', desc: 'Lựa chọn ra đáp án đúng trong 4 đáp án đưa ra.' },
      { id: 'match', title: 'Ghép thẻ', desc: 'Ghép thuật ngữ và định nghĩa của flashcard sao cho đúng.' },
    ];

    return (
      <Modal transparent visible={modeModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModeModalVisible(false)} />
          <View style={styles.modeModalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modeModalTitle}>Chọn chế độ học</Text>
            <View style={styles.modesContainer}>
              {modes.map((mode) => (
                <TouchableOpacity 
                  key={mode.id} 
                  style={[styles.modeOption, selectedModeId === mode.id && styles.modeOptionSelected]}
                  onPress={() => setSelectedModeId(mode.id)}
                >
                  <View style={[styles.radioCircle, selectedModeId === mode.id && styles.radioCircleSelected]}>
                    {selectedModeId === mode.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.modeTextRow}>
                    <Text style={styles.modeOptionTitle}>{mode.title}</Text>
                    <Text style={styles.modeOptionDesc}>{mode.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmModeBtn} onPress={handleConfirmMode}>
              <Text style={styles.confirmModeText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderOverview = () => {
    return (
      <View style={styles.container}>
        <View style={styles.headerOverview}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnOverview}>
            <ChevronLeft size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitleOverview}>{title}</Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollOverview}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
            {words.map((item) => (
              <View key={item.id} style={styles.slide}>
                <View style={styles.overviewCard}>
                    <View style={styles.cardHeader}>
                        <View style={{ width: 24 }} />
                        <TouchableOpacity><MoreVertical size={24} color="#111827" /></TouchableOpacity>
                    </View>
                    <View style={styles.cardCenter}>
                        <Text style={styles.overviewWord}>{item.en}</Text>
                        <Text style={styles.overviewPhonetic}>{item.phonetic}</Text>
                        <TouchableOpacity style={styles.speakerBtn}><Volume2 size={24} color="#FFFFFF" fill="#FFFFFF" /></TouchableOpacity>
                    </View>
                    <View style={styles.cardFooter}>
                        <View style={{ width: 24 }} /><TouchableOpacity><Maximize size={24} color="#111827" /></TouchableOpacity>
                    </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listSectionTitle}>Flashcards</Text>
            <TouchableOpacity><Sliders size={24} color="#6F767E" /></TouchableOpacity>
          </View>
          <View style={styles.wordsList}>
            {words.map((item) => (
              <FlashcardWordItem key={item.id} en={item.en} vi={item.vi} hideActions={true} />
            ))}
          </View>
          <View style={{height: 100}} />
        </ScrollView>
        <View style={styles.overviewFooterFixed}>
          <TouchableOpacity style={styles.studyMainBtn} onPress={() => setModeModalVisible(true)}>
            <Text style={styles.studyMainBtnText}>Học flashcard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStudy = () => {
    const currentWord = words[currentIndex] || { en: '...', vi: '...', phonetic: '...' };
    const learningIdx = selectedModeId === 'match' ? (matchBatchIndex + 1) * 5 : currentIndex + 1;
    const learningDisplay = learningIdx > totalCards ? totalCards : learningIdx;

    return (
      <View style={styles.container}>
        <View style={styles.studyHeader}>
          <TouchableOpacity onPress={() => setStep('OVERVIEW')}><X size={24} color="#111827" /></TouchableOpacity>
          <Text style={styles.progressText}>{selectedModeId === 'match' ? learningDisplay : currentIndex + 1}/{totalCards}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.contentPadding}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#E65050' }]}>{notLearnedCount.toString().padStart(2, '0')}</Text>
              <Text style={styles.statLabel}>Chưa thuộc</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#F4B43E' }]}>{learningDisplay.toString().padStart(2, '0')}</Text>
              <Text style={styles.statLabel}>Đang học</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#21A985' }]}>{learnedCount.toString().padStart(2, '0')}</Text>
              <Text style={styles.statLabel}>Đã thuộc</Text>
            </View>
          </View>

          {selectedModeId === 'basic' ? (
            <>
              <TouchableOpacity style={styles.studyCardContainer} activeOpacity={0.9} onPress={() => setIsFlipped(!isFlipped)}>
                <View style={styles.activeStudyCard}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      {!isFlipped ? (
                        <><Text style={styles.studyWord}>{currentWord.en}</Text><Text style={styles.studyPhonetic}>{currentWord.phonetic}</Text></>
                      ) : (
                        <Text style={styles.studyWord}>{currentWord.vi}</Text>
                      )}
                    </View>
                    <TouchableOpacity style={styles.studySpeakerBtn} onPress={(e) => e.stopPropagation()}><Volume2 size={24} color="#FFFFFF" fill="#FFFFFF" /></TouchableOpacity>
                </View>
              </TouchableOpacity>
              <View style={styles.studyActions}>
                <TouchableOpacity style={[styles.studyActionBtn, { backgroundColor: '#FF6B81' }]} onPress={() => handleNext(false)}>
                  <X size={20} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 8 }} />
                  <Text style={styles.studyActionText}>Không nhớ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.studyActionBtn, { backgroundColor: '#55BA5D' }]} onPress={() => handleNext(true)}>
                  <CheckCheck size={20} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 8 }} />
                  <Text style={styles.studyActionText}>Đã nhớ</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : selectedModeId === 'quiz' ? (
            <>
              <View style={styles.quizQuestionBox}>
                <Text style={styles.quizMainWord}>{currentWord.en}</Text>
                <Text style={styles.quizMainPhonetic}>{currentWord.phonetic}</Text>
                <TouchableOpacity style={styles.quizSpeakerBtn}><Volume2 size={24} color="#FFFFFF" fill="#FFFFFF" /></TouchableOpacity>
              </View>
              <View style={styles.quizOptionsGrid}>
                {quizOptions.map((opt, i) => {
                  const isCorrect = opt === currentWord.vi;
                  const isSelected = selectedAnswerIndex === i;
                  let cardStyle = [styles.quizOptionCard];
                  if (isAnswered) {
                    if (isCorrect) cardStyle.push(styles.quizOptionCorrect);
                    else if (isSelected) cardStyle.push(styles.quizOptionWrong);
                  }
                  return (
                    <TouchableOpacity key={i} style={cardStyle} onPress={() => handleQuizSelection(i)} activeOpacity={0.7}><Text style={styles.quizOptionText}>{opt}</Text></TouchableOpacity>
                  );
                })}
              </View>
              {isAnswered && (
                <View style={styles.quizFooter}>
                   <TouchableOpacity style={styles.quizNextBtn} onPress={handleNextQuiz}><Text style={styles.quizNextBtnText}>Tiếp theo</Text></TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={styles.matchGrid}>
              {matchItems.map((item, i) => {
                   const isSelected = selectedMatchIndices.includes(i);
                   const isError = mismatchedIndices.includes(i);
                   
                   let cardStyle = [styles.matchCard];
                   let textStyle = [styles.matchText];

                   if (item.matched) cardStyle.push(styles.matchCardMatched);
                   else if (isSelected) {
                     cardStyle.push(styles.matchCardSelected);
                     textStyle.push(styles.matchTextSelected);
                   }
                   else if (isError) cardStyle.push(styles.matchCardWrong);

                   return (
                     <TouchableOpacity 
                        key={i} 
                        style={cardStyle} 
                        onPress={() => handleMatchSelection(i)}
                        disabled={item.matched}
                        activeOpacity={0.8}
                      >
                       <Text style={textStyle}>{item.text}</Text>
                     </TouchableOpacity>
                   );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderResult = () => {
    const radius = 60;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;
    const progress = totalCards > 0 ? (learnedCount / totalCards) * 100 : 0;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.container}>
        <View style={styles.resultHeader}><Text style={styles.resultSummaryLabel}>{totalCards}/{totalCards}</Text></View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollResult}>
          <View style={styles.resultMainCard}>
            <Text style={styles.congratsText}>Chúc mừng! Bạn đã ôn tập tất cả các thẻ.</Text>
            <View style={styles.sectionLabel}><Text style={styles.sectionLabelText}>Kết quả</Text></View>
            <View style={styles.statsRowResult}>
              <View style={styles.summaryStatBox}><Text style={[styles.summaryStatValue, { color: '#E65050' }]}>{notLearnedCount}</Text><Text style={styles.summaryStatLabel}>Chưa thuộc</Text></View>
              <View style={styles.summaryStatBox}><Text style={[styles.summaryStatValue, { color: '#55BA5D' }]}>{learnedCount}</Text><Text style={styles.summaryStatLabel}>Đã thuộc</Text></View>
            </View>
            <View style={styles.sectionLabel}><Text style={styles.sectionLabelText}>Tiến độ của bạn</Text></View>
            <View style={styles.chartContainer}>
              <Svg width={140} height={140} viewBox="0 0 140 140">
                <G rotation="-90" origin="70, 70"><Circle cx="70" cy="70" r={radius} stroke="#D8F9D6" strokeWidth={strokeWidth} fill="none" /><Circle cx="70" cy="70" r={radius} stroke="#55BA5D" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="none" /></G>
              </Svg>
              <View style={styles.chartCenteredText}><Text style={styles.chartPercentText}>{Math.round(progress)}%</Text></View>
            </View>
            <View style={styles.sectionLabel}><Text style={styles.sectionLabelText}>Bước tiếp theo</Text></View>
            <View style={styles.nextStepsCard}>
              <TouchableOpacity style={styles.retryBtnSmall} onPress={resetStudy}><Text style={styles.retryBtnText}>Học lại</Text></TouchableOpacity>
              <TouchableOpacity style={styles.backBtnSmall} onPress={() => setStep('OVERVIEW')}><Text style={styles.backBtnText}>Quay về</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {step === 'OVERVIEW' && renderOverview()}
      {step === 'STUDY' && renderStudy()}
      {step === 'RESULT' && renderResult()}
      {renderModeModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F8' },
  scrollOverview: { paddingBottom: 40 },
  headerOverview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 30 : 44, paddingBottom: 10 },
  backBtnOverview: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  headerTitleOverview: { fontFamily: 'WorkSans_700Bold', fontSize: 20, color: '#111827' },
  carouselContainer: { marginTop: 10, marginBottom: 24 },
  slide: { width: width, paddingHorizontal: 24, alignItems: 'center' },
  overviewCard: { backgroundColor: '#C8F0ED', borderRadius: 30, padding: 20, height: width * 0.95, width: '100%' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  overviewWord: { fontFamily: 'WorkSans_700Bold', fontSize: 24, color: '#1F244B', marginBottom: 4 },
  overviewPhonetic: { fontFamily: 'WorkSans_500Medium', fontSize: 16, color: '#6B7280', marginBottom: 20 },
  speakerBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0085E8', justifyContent: 'center', alignItems: 'center', shadowColor: '#0085E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 24 },
  listSectionTitle: { fontFamily: 'WorkSans_700Bold', fontSize: 24, color: '#111827' },
  wordsList: { paddingBottom: 20, paddingHorizontal: 24 },
  overviewFooterFixed: { position: 'absolute', bottom: 30, left: 24, right: 24 },
  studyMainBtn: { backgroundColor: '#55BA5D', height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#55BA5D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 3 },
  studyMainBtnText: { fontFamily: 'WorkSans_700Bold', fontSize: 18, color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modeModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 30, paddingTop: 12, alignItems: 'center' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, marginBottom: 24 },
  modeModalTitle: { fontFamily: 'WorkSans_700Bold', fontSize: 28, color: '#1F244B', marginBottom: 32 },
  modesContainer: { width: '100%', marginBottom: 32 },
  modeOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 20, padding: 16, marginBottom: 16 },
  modeOptionSelected: { backgroundColor: '#F0FFF0' },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  radioCircleSelected: { borderColor: '#55BA5D' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#55BA5D' },
  modeTextRow: { flex: 1 },
  modeOptionTitle: { fontFamily: 'WorkSans_500Medium', fontSize: 16, color: '#111827', marginBottom: 4 },
  modeOptionDesc: { fontFamily: 'WorkSans_400Regular', fontSize: 12, color: '#9B99A3' },
  confirmModeBtn: { backgroundColor: '#55BA5D', width: '100%', height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  confirmModeText: { fontFamily: 'WorkSans_700Bold', fontSize: 18, color: '#FFFFFF' },
  studyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 30 : 44, paddingBottom: 10 },
  contentPadding: { flex: 1, paddingHorizontal: 24 },
  progressText: { fontFamily: 'WorkSans_700Bold', fontSize: 20, color: '#111827' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingTop: 10 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontFamily: 'WorkSans_700Bold', fontSize: 20, marginBottom: 4 },
  statLabel: { fontFamily: 'WorkSans_500Medium', fontSize: 12, color: '#696674' },
  studyCardContainer: { flex: 1, justifyContent: 'center', marginBottom: 40 },
  activeStudyCard: { backgroundColor: '#C8F0ED', borderRadius: 30, height: width * 1.1, padding: 24, justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 },
  studyWord: { fontFamily: 'WorkSans_700Bold', fontSize: 32, color: '#1F244B', marginBottom: 10 },
  studyPhonetic: { fontFamily: 'WorkSans_500Medium', fontSize: 18, color: '#6B7280' },
  studySpeakerBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0085E8', justifyContent: 'center', alignItems: 'center', shadowColor: '#0085E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  studyActions: { flexDirection: 'row', gap: 16, paddingBottom: 40 },
  studyActionBtn: { flex: 1, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  studyActionText: { fontFamily: 'WorkSans_600SemiBold', fontSize: 14, color: '#FFFFFF' },
  quizQuestionBox: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  quizMainWord: { fontFamily: 'WorkSans_700Bold', fontSize: 32, color: '#1F244B', textAlign: 'center', marginBottom: 8 },
  quizMainPhonetic: { fontFamily: 'WorkSans_500Medium', fontSize: 20, color: '#696674', textAlign: 'center', marginBottom: 20 },
  quizSpeakerBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4B7BE5', justifyContent: 'center', alignItems: 'center', shadowColor: '#4B7BE5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  quizOptionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  quizOptionCard: { width: (width - 64) / 2, height: 100, backgroundColor: '#E2F2FD', borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 12, borderWidth: 2, borderColor: 'transparent' },
  quizOptionText: { fontFamily: 'WorkSans_500Medium', fontSize: 16, color: '#111827', textAlign: 'center' },
  quizOptionCorrect: { backgroundColor: '#E8FAE6', borderColor: '#55BA5D' },
  quizOptionWrong: { backgroundColor: '#FFD9DF', borderColor: '#FF6B81' },
  quizFooter: { marginTop: 40, paddingBottom: 40 },
  quizNextBtn: { backgroundColor: '#55BA5D', height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#55BA5D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 3 },
  quizNextBtnText: { fontFamily: 'WorkSans_700Bold', fontSize: 18, color: '#FFFFFF' },
  matchGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginTop: 10 },
  matchCard: { width: (width - 64) / 2, height: 80, backgroundColor: '#E2F2FD', borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 10, borderWidth: 2, borderColor: 'transparent', marginBottom: 4 },
  matchCardSelected: { backgroundColor: '#0085E8', borderColor: '#0085E8' },
  matchCardMatched: { opacity: 0 },
  matchCardWrong: { backgroundColor: '#FFD9DF', borderColor: '#FF6B81' },
  matchText: { fontFamily: 'WorkSans_500Medium', fontSize: 16, color: '#111827', textAlign: 'center' },
  matchTextSelected: { color: '#FFFFFF' },
  resultHeader: { alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 30 : 44, marginBottom: 40 },
  resultSummaryLabel: { fontFamily: 'WorkSans_700Bold', fontSize: 20, color: '#1F244B' },
  scrollResult: { paddingHorizontal: 24, paddingBottom: 40 },
  resultMainCard: { backgroundColor: 'rgba(206, 237, 179, 0.5)', borderRadius: 30, padding: 24, width: '100%' },
  congratsText: { fontFamily: 'WorkSans_600SemiBold', fontSize: 16, textAlign: 'center', color: '#000000', marginBottom: 30, lineHeight: 24 },
  sectionLabel: { marginBottom: 12 },
  sectionLabelText: { fontFamily: 'WorkSans_600SemiBold', fontSize: 13, color: '#000000' },
  statsRowResult: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 24 },
  summaryStatBox: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  summaryStatValue: { fontFamily: 'WorkSans_700Bold', fontSize: 24, marginBottom: 4 },
  summaryStatLabel: { fontFamily: 'WorkSans_500Medium', fontSize: 12, color: '#9B99A3' },
  chartContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  chartCenteredText: { position: 'absolute', alignItems: 'center' },
  chartPercentText: { fontFamily: 'WorkSans_700Bold', fontSize: 32, color: '#55BA5D' },
  nextStepsCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, flexDirection: 'row', justifyContent: 'space-between', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  retryBtnSmall: { flex: 1, backgroundColor: '#9ED0FE', height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  retryBtnText: { fontFamily: 'WorkSans_700Bold', fontSize: 16, color: '#FFFFFF' },
  backBtnSmall: { flex: 1, backgroundColor: '#55BA5D', height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { fontFamily: 'WorkSans_700Bold', fontSize: 16, color: '#FFFFFF' },
});
