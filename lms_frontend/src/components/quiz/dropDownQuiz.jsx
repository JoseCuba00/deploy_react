import React, { useState, useEffect, useCallback } from "react";
import DropdownZone from "./dropDownZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";

const DropDownQuiz = ({
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
  isText,
  userId,
}) => {
  const titles = useCallback(() => {
    return sentencesList.map(() => ({ title: "Select an item" })); // genera el array donde se van a guardar los titulos
  }, [sentencesList]);

  const shuffleChoices = useCallback(() => {
    return shuffleArray(choices); // genera el array donde se van a guardar los titulos
  }, [choices]);

  const [dropDownValue, SetdropDownValue] = useState(titles);
  const [ShowResult, SetShowResult] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState(shuffleChoices);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeQuestion = () => {
      // Se inicializan los estados ya que si se cambia de una pregunta a otra que tiene le mismo tipo los estados no cambian
      SetdropDownValue(titles);
      SetShowResult(false);
      setCompleted(false);
      setShuffledChoices(shuffleChoices);
      setLoading(true);

      if (isCompleted) {
        SetdropDownValue(
          answers.map((id) => choices.find((item) => item.id === id))
        );
        SetShowResult(true);
        setCompleted(true);
        setLoading(false);
      }
      if (shuffledChoices.length > 0) {
        setLoading(false);
      }
    };
    initializeQuestion();
  }, [shuffleArray, choices]);

  const changeValue = useCallback((box, questionId, text) => {
    SetdropDownValue((prev) => ({
      ...prev,
      [box]: { title: text, id: questionId, isCorrect: null },
    }));
  }, []);

  const onClickSubmit = async () => {
    let score = 0;
    Object.values(dropDownValue).map((object, index) => {
      object.isCorrect = object.id === answers[index];
      if (object.isCorrect === true) {
        score++;
      }
    });
    if (score === answers.length) {
      setCompleted(true);

      // Cambia los datos y hace el put request
      isCompleted === false &&
        ChangeData(
          setQuestionData,
          setTopicData,
          questionId,
          assignments_id,
          userId,
          "questions_update"
        );
    }
    SetShowResult(true);
  };

  const onClickNext = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };
  const onClickReset = () => {
    SetShowResult(false);
    SetdropDownValue(titles);
    setShuffledChoices(shuffleChoices);
    setCompleted(false);
  };

  return (
    <div className="QuestionsContainer">
      <div className="text">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="container">
            <DropdownZone
              sentencesList={sentencesList}
              title={dropDownValue}
              objects={shuffledChoices}
              clickFunction={changeValue}
              disabled={ShowResult}
              isText={isText}
            />
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

export default DropDownQuiz;
