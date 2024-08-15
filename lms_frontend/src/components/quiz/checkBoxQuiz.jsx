import React from "react";
import { useState, useEffect, useCallback } from "react";
import { CheckBoxZone } from "./checkBoxZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
import { convertToSpeech } from "../actions/actions";
import HeadingQuestions from "../headingQuestion";

const CheckBoxQuiz = ({
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
  const initializeShuffledChoices = useCallback(() => {
    return shuffleArray(choices);
  }, [choices]);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [ShowResult, SetShowResult] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState(
    initializeShuffledChoices
  );
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const initializeQuestion = () => {
      if (isCompleted) {
        setSelectedCheckboxes(answers.map((answer) => ({ id: answer })));
        SetShowResult(true);
        setCompleted(true);
        setLoading(false);
        setShuffledChoices(initializeShuffledChoices);
      } else {
        setSelectedCheckboxes([]);
        SetShowResult(false);
        setCompleted(false);
        setShuffledChoices(initializeShuffledChoices);
        setLoading(false);
      }
      if (shuffledChoices.length > 0) {
        setLoading(false);
      }
    };

    initializeQuestion();
  }, [isCompleted, choices, answers]);

  const onAnswerClick = (choice, id) => {
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      const isAlreadySelected = prevSelectedCheckboxes.some(
        (item) => item.id === id
      );

      if (isAlreadySelected) {
        return prevSelectedCheckboxes.filter((item) => item.id !== id); // Si el elemento ya exite "lo elimina"
      }

      const newCorrectAnswer = answers.find((answer) => answer === id)
        ? true
        : false; // comprueba si el elemento esta en la respuesta
      return [...prevSelectedCheckboxes, { id, IsCorrect: newCorrectAnswer }]; // si el elemento no existe lo agriega
    });
  };

  const onClickSubmit = () => {
    let score = 0;

    selectedCheckboxes.forEach((obj, index) => {
      if (obj.IsCorrect) {
        score++;
      } else {
        score--;
      }
    });

    SetShowResult(true);

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
  };

  const onClickNext = useCallback(() => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  }, [setCurrentQuestion]);

  const onClickReset = useCallback(() => {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false)); // Para deseleccionar los inputs
    setSelectedCheckboxes([]);
    SetShowResult(false);
    setShuffledChoices(shuffleArray(choices));
    setCompleted(false);
  }, [choices, shuffleArray]);

  return (
    <div className="QuestionsContainer">
      <div className="text">
        {loading ? (
          <LoadingIndicator /> // Muestra el símbolo de carga
        ) : (
          <div className="container">
            <div className="ps-4">
              <div className="ps-3">
                <h4 className="pb-3">Select all the correct answers</h4>
                <HeadingQuestions
                  convertToSpeech={convertToSpeech}
                  sentence={sentencesList[0].title}
                  setIsPlaying={setIsPlaying}
                  isPlaying={isPlaying}
                  animate={true}
                />
              </div>
              <CheckBoxZone
                title={sentencesList}
                choices={shuffledChoices}
                selectedChoices={selectedCheckboxes}
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

export default CheckBoxQuiz;
