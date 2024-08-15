import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { ClickToRowZone } from "./ClickToRowZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
import { convertToSpeech } from "../actions/actions";
import HeadingQuestions from "../headingQuestion";

const ClickToRowQuiz = ({
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
  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState(shuffleArray(choices));
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      let row1 = answers.map((id) => choices.find((item) => item.id === id));
      setRow1(row1); // se le anade a la primera fila las opciones correctar
      // se eliminan las opciones correcta de la segunda fila y se guardan en dicha fila
      setRow2(
        choices.filter(
          (item2) => !row1.some((item1) => item1.title === item2.title)
        )
      );
      setShowResult(true);
      setCompleted(true);
      setLoading(false);
    } else {
      setRow1([]);
      setRow2(shuffleArray(choices));
      setShowResult(false);
      setCompleted(false);
      setLoading(true);
    }
    if (row2.length > 0 || row1.length > 0) {
      setLoading(false);
    }
  }, [isCompleted, choices]);

  const handleClick = useCallback((word, fromRow, toRow) => {
    fromRow((prev) => prev.filter((item) => item !== word));
    toRow((prev) => [...prev, word]);
  }, []);

  const onClickSubmit = () => {
    let score = 0;
    const updatedRow1 = row1.map((obj, index) => ({
      ...obj,
      isCorrect: obj.id === answers[index],
    }));

    updatedRow1.forEach((obj, index) => {
      if (obj.isCorrect) {
        score++;
      } else {
        score--;
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

    setRow1(updatedRow1);
    setShowResult(true);
  };
  const onClickNext = () => {
    setCurrentQuestion((prev) => prev + 1);
  };
  const onClickReset = useCallback(() => {
    setRow1([]);
    setRow2(shuffleArray(choices));
    setShowResult(false);
    setCompleted(false);
  }, [choices, shuffleArray]);

  return (
    <div className="QuestionsContainer">
      <div className="text">
        {loading ? (
          <LoadingIndicator /> // Muestra el símbolo de carga
        ) : (
          <div>
            <DragDropContext>
              <h4 className="pb-3 pt-5 ps-4">
                Translate the following sentence
              </h4>

              <HeadingQuestions
                convertToSpeech={convertToSpeech}
                sentence={sentencesList[0].title}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
                animate={true}
              />

              <ClickToRowZone
                id="row1"
                choices={row1}
                setRow1={setRow1}
                setRow2={setRow2}
                onClickFunction={handleClick}
                disabled={showResult}
                completed={null}
              />
              <ClickToRowZone
                id="row2"
                choices={row2}
                setRow1={setRow1}
                setRow2={setRow2}
                onClickFunction={handleClick}
                disabled={showResult}
                completed={showResult ? completed : null}
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
            </DragDropContext>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickToRowQuiz;
