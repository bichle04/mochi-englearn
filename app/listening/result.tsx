import React from "react";
import { useLocalSearchParams } from "expo-router";
import QuizResult, { ResultItem } from "../../components/shared/QuizResult";
import { LISTENING_CORRECT_ANSWERS, LISTENING_LABELS } from "../../data/mockListeningData";

export default function ListeningResultScreen() {
  const { userAnswers } = useLocalSearchParams();
  const parsedAnswers = userAnswers ? JSON.parse(userAnswers as string) : {};
  
  const results: ResultItem[] = Object.keys(LISTENING_CORRECT_ANSWERS).map(key => {
    const id = parseInt(key);
    const correctAns = LISTENING_CORRECT_ANSWERS[id];
    // In our quiz app, answer keys are strings like "1", "2", etc.
    const userAns = parsedAnswers[id.toString()] || "No Answer";
    const isCorrect = userAns.trim().toLowerCase() === correctAns.toLowerCase();
    
    return { 
      id, 
      isCorrect, 
      userAns, 
      correctAns,
      label: LISTENING_LABELS[id]
    };
  });

  const correctCount = results.filter(r => r.isCorrect).length;
  const accuracy = Math.round((correctCount / Object.keys(LISTENING_CORRECT_ANSWERS).length) * 100);
  
  // Calculate Band Score based on a rough IELTS scale for 10 questions
  const bandScoreVal = Math.floor((correctCount / 10) * 9 * 2) / 2;
  const bandScore = bandScoreVal % 1 === 0 ? `${bandScoreVal}.0` : bandScoreVal.toString();

  return (
    <QuizResult 
      bandScore={bandScore}
      correctCount={correctCount}
      totalQuestions={Object.keys(LISTENING_CORRECT_ANSWERS).length}
      accuracy={accuracy}
      results={results}
      explanationRoute="/listening/explanation"
    />
  );
}
