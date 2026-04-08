import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { FillBlankExercise } from '@/components/exercises/FillBlankExercise';
import { MultipleChoiceExercise } from '@/components/exercises/MultipleChoiceExercise';
import { WordDefinitionMatchingExercise } from '@/components/exercises/WordDefinitionMatchingExercise';
import { WordOrderExercise } from '@/components/exercises/WordOrderExercise';

export default function LessonScreen() {
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const exercises = [
    {
      id: '1',
      type: 'fill-blank',
      word: { word: 'collaborate' }, 
      blankedSentence: 'We need to _________ with the marketing team on this project.',
      correctAnswer: 'collaborate',
      ipaHint: "/kə'læbəreɪt/",
    },
    {
      id: '2',
      type: 'multiple-choice',
      word: { word: 'Exacerbate', pronunciation: "/ɪɡˈzæs.ə.beɪt/" },
      options: [
        "To make a problem, bad situation, or negative feeling worse",
        "To give something new life or energy",
        "To reduce the severity or impact of an action",
        "To carefully examine or study a complex process"
      ],
      correctAnswer: "To make a problem, bad situation, or negative feeling worse",
    },
    {
      id: '3',
      type: 'matching',
      matchingPairs: [
        {
          word: "Empirical",
          pronunciation: "/ɪmˈpɪr.ɪ.kəl/",
          definition: "Based on observation, experience, or experiment rather than theory"
        },
        {
          word: "Elucidate",
          pronunciation: "/ɪˈluː.sɪ.deɪt/",
          definition: "To make something clearer by explanation"
        },
        {
          word: "Cogent",
          pronunciation: "/ˈkoʊ.dʒənt/",
          definition: "Clear, logical, and convincing"
        },
        {
          word: "Ambiguous",
          pronunciation: "/æmˈbɪɡ.ju.əs/",
          definition: "Open to more than one interpretation; unclear"
        }
      ]
    },
    {
      id: '4',
      type: 'word-order',
      correctAnswer: 'The unemployment rate increased drastically since 2020.',
      options: ['The', 'unemployment', 'rate', 'increased', 'drastically', 'since', '2020.'],
      isLast: true
    }
  ];

  const currentExercise = exercises[currentExerciseIndex];

  const handleCheck = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setShowAnswer(false);
      
      const nextType = exercises[nextIndex].type;
      if (nextType === 'matching') {
        setUserAnswer({});
      } else if (nextType === 'word-order') {
        setUserAnswer([]);
      } else {
        setUserAnswer('');
      }
    } else {
      setShowCompleteModal(true);
    }
  };

  const handlePrev = () => {
    if (currentExerciseIndex > 0) {
      const prevIndex = currentExerciseIndex - 1;
      setCurrentExerciseIndex(prevIndex);
      setShowAnswer(false);

      const prevType = exercises[prevIndex].type;
      if (prevType === 'matching') {
        setUserAnswer({});
      } else if (prevType === 'word-order') {
        setUserAnswer([]);
      } else {
        setUserAnswer('');
      }
    } else {
      setShowAnswer(false);
      setUserAnswer('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={20} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>6.0 IELTS - {currentExerciseIndex + 1}/{exercises.length}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((currentExerciseIndex + 1) / (exercises.length)) * 100}%` }]} />
      </View>

      <View style={styles.content}>
        {currentExercise.type === 'fill-blank' && (
          <FillBlankExercise
            exercise={currentExercise as any}
            showAnswer={showAnswer}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            onCheck={handleCheck}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentExercise.type === 'multiple-choice' && (
          <MultipleChoiceExercise
            exercise={currentExercise as any}
            showAnswer={showAnswer}
            selectedOption={userAnswer}
            setSelectedOption={setUserAnswer}
            onCheck={handleCheck}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentExercise.type === 'matching' && (
          <WordDefinitionMatchingExercise
            exercise={currentExercise as any}
            showAnswer={showAnswer}
            matches={typeof userAnswer === 'object' ? userAnswer : {}}
            setMatches={setUserAnswer}
            onCheck={handleCheck}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentExercise.type === 'word-order' && (
          <WordOrderExercise
            exercise={currentExercise as any}
            showAnswer={showAnswer}
            userAnswer={Array.isArray(userAnswer) ? userAnswer : []}
            setUserAnswer={setUserAnswer}
            onCheck={handleCheck}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </View>

      {/* Completion Modal */}
      <Modal
        visible={showCompleteModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Review Complete! 🎉</Text>
            <Text style={styles.modalBody}>
              Great job! You reviewed {exercises.length} questions with 70% accuracy. Mochi are proud of you!
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowCompleteModal(false);
                router.back();
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#1E293B',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 24,
    borderRadius: 5,
    marginBottom: 32,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#55BA5D',
    borderRadius: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Slightly darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24, // Adjust container padding
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // More standard dialog rounding
    padding: 28,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'left', // Aligned left
  },
  modalBody: {
    fontFamily: 'Lexend_300Light', // Thinner feel as requested
    fontSize: 16,
    color: '#475569',
    textAlign: 'left', // Aligned left
    lineHeight: 28,
    marginBottom: 32,
  },
  modalButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
  },
  modalButtonText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: '#0185E8', // Blue color for OK
  },
});
