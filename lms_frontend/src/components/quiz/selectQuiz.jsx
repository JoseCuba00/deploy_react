import React, { useState, useMemo, useCallback, useEffect } from "react";
import SelectZone from "./selectedZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
// Usar un estado local para las elecciones seleccionadas

const SelectQuiz = ({
  sentencesList,
  choices,
  answers,
  setCurrentQuestion,
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
  const chunkSize = 3;

  // Memoizar la transformación de choices para evitar cálculos innecesarios
  const choicesTransform = useCallback(() => {
    const chunks = [];
    for (let i = 0; i < choices.length; i += chunkSize) {
      chunks.push(choices.slice(i, i + chunkSize)); // Poner los datos en la siguiente estructura [[{},{},{}],[{},{},{}]]
    }

    return chunks;
  }, [choices]);

  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shuffledChoices, setShuffledChoices] = useState(choicesTransform);

  const updateSelected = (box, obj, answers) => {
    if (!obj) return; // Prevent error if obj is undefined
    setSelected((prev) => {
      let isCorrect = obj.id === answers[box];
      const newSelected = [...prev];
      newSelected[box] = { id: obj.id, isCorrect: isCorrect };
      return newSelected;
    });
  };

  useEffect(() => {
    const initializeQuestion = () => {
      if (isCompleted) {
        setSelected(answers.map((answer) => ({ id: answer })));
        setShowResult(true);
        setCompleted(true);
        setLoading(false);
        setShuffledChoices(choicesTransform);
      } else {
        setShowResult(false);
        setCompleted(false);
        setLoading(true);
        setShuffledChoices(choicesTransform);
        setSelected([]);
      }
      if (shuffledChoices.length > 0) {
        setLoading(false);
      }
    };

    initializeQuestion();
  }, [isCompleted, choices, answers]);

  const onAnswerClick = (box, obj) => {
    updateSelected(box, obj, answers);
  };

  const onClickSubmit = () => {
    let score = 0;
    selected.forEach((obj, index) => {
      if (obj.isCorrect) {
        score++;
      }
    });
    if (score === answers.length) {
      setCompleted(true);
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
    setShowResult(true);
  };

  const onClickNext = useCallback(() => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  }, [setCurrentQuestion]);

  const onClickReset = () => {
    document
      .querySelectorAll("input[type=radio]")
      .forEach((el) => (el.checked = false));
    setSelected([]);
    setShowResult(false);
    setCompleted(false);
  };

  return (
    <div className="QuestionsContainer">
      <div className="text">
        {loading ? (
          <LoadingIndicator /> // Muestra el símbolo de carga
        ) : (
          <div className="container">
            <SelectZone
              objects={shuffledChoices}
              ClickFunction={onAnswerClick}
              list={sentencesList}
              selectedChoices={selected}
              disabled={showResult}
              answers={answers}
              isText={isText}
            />
            <QuizBottons
              buttonName={
                showResult
                  ? completed
                    ? "Solve again"
                    : "Try again"
                  : "Submit"
              }
              completed={showResult ? completed : null}
              onClickButton={showResult ? onClickReset : onClickSubmit}
              onClickNext={onClickNext}
              Next={currentQuestion === totalQuestions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectQuiz;
