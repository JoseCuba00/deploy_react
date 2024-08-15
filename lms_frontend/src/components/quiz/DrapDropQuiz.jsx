import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { DroppableZoneMain, DroppableZoneSentence } from "./drapDropZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
import styled from "styled-components";

const FullContainer = styled.div`
  width: 897px;
  ${(props) =>
    !props.$isText &&
    `
    display: flex;
    justify-content: space-between;
  `}
`;

const DragDropQuiz = ({
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
  const initializeShuffledChoices = useCallback(() => {
    let defaultObjects = sentencesList.map(() => []);
    defaultObjects.splice(
      0,
      0,
      JSON.parse(JSON.stringify(shuffleArray(choices)))
    );
    return defaultObjects;
  }, [choices, sentencesList, shuffleArray]);

  const [showResult, setShowResult] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState(
    initializeShuffledChoices
  );
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effect to handle initialization of the question
  useEffect(() => {
    const initializeQuestion = () => {
      setShowResult(false);
      setCompleted(false);
      setShuffledChoices(initializeShuffledChoices());
      setLoading(true);

      if (isCompleted) {
        let defaultObjects = sentencesList.map(() => []);
        defaultObjects = defaultObjects.map((obj, index) => {
          const foundItem = choices.find((item) => item.id === answers[index]);
          return [foundItem];
        });
        defaultObjects.splice(0, 0, []);

        setShuffledChoices(defaultObjects);
        setShowResult(true);
        setCompleted(true);
      }
      if (shuffledChoices.length > 0) {
        setLoading(false);
      }
    };

    initializeQuestion();
  }, [
    choices,
    questionId,
    initializeShuffledChoices,
    sentencesList,
    answers,
    isCompleted,
  ]);

  const handleOnDragEnd = useCallback(
    (result) => {
      const { destination, source, draggableId } = result;

      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      ) {
        return;
      }

      const getId = choices.find((objeto) => objeto.title === draggableId);

      if (result.destination.droppableId === result.source.droppableId) {
        const updatedChoices = [...shuffledChoices];
        updatedChoices[source.droppableId].splice(source.index, 1);
        updatedChoices[destination.droppableId].splice(destination.index, 0, {
          id: getId.id,
          title: draggableId,
        });
        setShuffledChoices(updatedChoices);
      } else if (
        shuffledChoices[destination.droppableId].length === 0 ||
        result.destination.droppableId === "0"
      ) {
        const updatedChoices = [...shuffledChoices];
        updatedChoices[source.droppableId].splice(source.index, 1);
        updatedChoices[destination.droppableId].push({
          id: getId.id,
          title: draggableId,
        });
        setShuffledChoices(updatedChoices);
      }
    },
    [shuffledChoices, choices]
  );

  const onClickSubmit = async () => {
    let score = 0;
    let updatedChoices;
    try {
      updatedChoices = shuffledChoices.map((obj, index) => {
        if (index === 0) return obj;
        let isCorrect = obj[0].id === answers[index - 1];

        if (isCorrect) score++;
        return [{ ...obj[0], isCorrect }];
      });
    } catch {
      const successAlert = () => {
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert-popup";
        alertDiv.textContent = "⚠️ You have to fill all the empty spaces";
        document.body.appendChild(alertDiv);

        setTimeout(() => {
          document.body.removeChild(alertDiv);
        }, 3000);
      };
      return successAlert();
    }

    setShuffledChoices(updatedChoices);

    if (score === answers.length) {
      setCompleted(true);
      if (!isCompleted) {
        ChangeData(
          setQuestionData,
          setTopicData,
          questionId,
          assignments_id,
          userId,
          "questions_update"
        );
      }
    }
    setShowResult(true);
  };

  const onClickNext = useCallback(() => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  }, [setCurrentQuestion]);

  const onClickReset = useCallback(() => {
    setShowResult(false);
    setShuffledChoices(initializeShuffledChoices());
    setCompleted(false);
  }, [initializeShuffledChoices]);

  console.log(isText);
  return (
    <div className="QuestionsContainer">
      <div className="text">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <div>
              <FullContainer $isText={isText}>
                <DroppableZoneSentence
                  list={sentencesList}
                  objects={shuffledChoices}
                  disabled={showResult}
                  isText={isText}
                />

                <DroppableZoneMain
                  id={"0"}
                  objects={shuffledChoices[0]}
                  isText={isText}
                />
              </FullContainer>
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
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default DragDropQuiz;
