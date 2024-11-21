import React, { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { ClickToRowZone } from "./ClickToRowZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
import SentenceRecorder from "../SentenceRecorder";

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

  const isSpanish = (text) => /^[a-záéíóúñü\s.,;!?¿¡]+$/i.test(text);
  console.log("me reenderizo entero");

  useEffect(() => {
    const initializeRows = () => {
      if (isCompleted) {
        const row1Data = answers.map((id) =>
          choices.find((item) => item.id === id)
        );
        setRow1(row1Data);
        setRow2(
          choices.filter(
            (item) => !row1Data.some((rowItem) => rowItem.id === item.id)
          )
        );
        setShowResult(true);
        setCompleted(true);
      } else {
        setRow1([]);

        setRow2(shuffleArray(choices));
        setShowResult(false);
        setCompleted(false);
      }
      setLoading(false);
    };

    initializeRows();
  }, [isCompleted, choices, shuffleArray, answers]);

  const handleClick = useCallback((word, fromRow, toRow) => {
    fromRow((prev) => prev.filter((item) => item !== word));
    toRow((prev) => [...prev, word]);
  }, []);

  const onClickSubmit = () => {
    const updatedRow1 = row1.map((obj, index) => ({
      ...obj,
      isCorrect: obj.id === answers[index],
    }));

    const score = updatedRow1.reduce(
      (acc, obj) => acc + (obj.isCorrect ? 1 : -1),
      0
    );

    if (score === answers.length) {
      setCompleted(true);
      if (!isCompleted) {
        ChangeData(
          setQuestionData,
          setTopicData,
          questionId,
          assignments_id,
          userId,
          "question",
          "questions_update"
        );
      }
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
          <LoadingIndicator />
        ) : (
          <div>
            <DragDropContext>
              <h4 className="pb-3 pt-5 ps-4">
                Translate the following sentence
              </h4>
              <div className="ms-4">
                {isSpanish(sentencesList[0].title) ? (
                  <SentenceRecorder
                    sentence={sentencesList[0].title}
                    showPlayButton
                    playSize={24}
                    cancelSize={20}
                    microphoneSize={24}
                  />
                ) : (
                  <span className="ps-2">{sentencesList[0].title}</span>
                )}
              </div>
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
