import React from "react";
import { useLocalSearchParams } from "expo-router";
import QuizResult, { ResultItem } from "../../components/shared/QuizResult";
import { CORRECT_MAP } from "../../data/mockReadingData";

export default function ReadingResultScreen() {
  const { userAnswers } = useLocalSearchParams();
  const parsedAnswers = userAnswers ? JSON.parse(userAnswers as string) : {};

  const results: ResultItem[] = Object.keys(CORRECT_MAP).map(key => {
    const id = parseInt(key);
    const correctAns = CORRECT_MAP[id];
    const userAns = parsedAnswers[id] || "No Answer";
    const isCorrect = userAns.trim().toLowerCase() === correctAns.toLowerCase();

    return { id, isCorrect, userAns, correctAns };
  });

  const correctCount = results.filter(r => r.isCorrect).length;
  const accuracy = Math.round((correctCount / 10) * 100);
  const bandScore = Math.floor((correctCount / 10) * 9 * 2) / 2;
  const bandScoreFmt = bandScore % 1 === 0 ? `${bandScore}.0` : bandScore.toString();

  return (
    <QuizResult 
      bandScore={bandScoreFmt}
      correctCount={correctCount}
      totalQuestions={10}
      accuracy={accuracy}
      results={results}
      explanationRoute="/reading/explanation"
    />
  );
}
