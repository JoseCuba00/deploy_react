import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { QuizZone } from "./quizZone";
import { QuizBottons } from "../quizBottons";
import { ChangeData } from "../actions/actions";
import LoadingIndicator from "../LoadingIndicator";
import { convertToSpeech } from "../actions/actions";
import HeadingQuestions from "../headingQuestion";

const RadioQuiz = ({
  sentencesList,
  choices,
  answers,
  setCurrentQuestion,
  shuffleArray,
  questionId,
  setQuestionData,
  isCompleted,
  currentQuestion,
  totalQuestions,
  setTopicData,
  assignments_id,
  userId,
}) => {
  const shuffleChoices = useCallback(() => {
    return shuffleArray(choices); // genera el array donde se van a guardar los titulos
  }, [choices]);
  console.log("Me renderizo");
  const [answerId, setAnswerId] = useState(null);
  const [IsCorrect, SetIsCorrect] = useState(null);
  const [ShowResult, SetShowResult] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect to handle loading and resetting question data
  useEffect(() => {
    const initializeQuestion = () => {
      setAnswerId(null);
      SetIsCorrect(null);
      SetShowResult(false);
      setCompleted(false);
      setShuffledChoices(shuffleChoices);
      setLoading(false);

      if (isCompleted) {
        setAnswerId(answers[0]);
        SetShowResult(true);
        setCompleted(true);
      }
    };

    initializeQuestion();
  }, [isCompleted, choices, answers, shuffleArray, questionId]);

  const onAnswerClick = (id) => {
    setAnswerId(id);
    SetIsCorrect(id === answers[0]);
  };

  const onClickSubmit = () => {
    SetShowResult(true);
    setCompleted(IsCorrect);

    if (!isCompleted && IsCorrect) {
      ChangeData(
        setQuestionData,
        setTopicData,
        questionId,
        assignments_id,
        userId,
        "questions_update"
      );
    }
  };

  const onClickNext = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const onClickReset = () => {
    setAnswerId(null);
    document
      .querySelectorAll("input[type=radio]")
      .forEach((el) => (el.checked = false));
    SetShowResult(false);
    setShuffledChoices(shuffleChoices);
    setCompleted(false);
  };

  return (
    <div className="QuestionsContainer">
      <div className="text ">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="container">
            <div className="ps-4">
              <div className="ps-3">
                <h4 className="pb-3">Select the correct answer</h4>
                <HeadingQuestions
                  convertToSpeech={convertToSpeech}
                  sentence={sentencesList[0].title}
                  setIsPlaying={setIsPlaying}
                  isPlaying={isPlaying}
                  animate={true}
                />
              </div>
              <QuizZone
                title={sentencesList}
                choices={shuffledChoices}
                selectedAnswer={answerId}
                IsCorrect={ShowResult ? IsCorrect : null}
                onAnswerClick={onAnswerClick}
                disabled={ShowResult}
              />
            </div>
            <QuizBottons
              buttonName={
                ShowResult
                  ? completed
                    ? "Solve again"
                    : "Try again"
                  : "Submit"
              }
              completed={ShowResult ? completed : null}
              onClickButton={ShowResult ? onClickReset : onClickSubmit}
              onClickNext={onClickNext}
              Next={currentQuestion === totalQuestions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RadioQuiz;
