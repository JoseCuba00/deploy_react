import React, { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { DroppableZoneMain, DroppableZoneSentence } from "./drapDropZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
import styled from "styled-components";
import { convertToSpeech } from "../actions/actions";

const FullContainer = styled.div`
  width: 90%;
  padding: 3%;
  ${(props) =>
    !props.$isText &&
    `
    display: flex;
    justify-content: space-between;
  `}
`;

const initializeShuffledChoices = (sentencesList, shuffleArray, choices) => {
  let defaultObjects = sentencesList.map(() => []);
  defaultObjects.splice(
    0,
    0,
    JSON.parse(JSON.stringify(shuffleArray(choices)))
  );
  return defaultObjects;
};

const initializeCompletedChoices = (sentencesList, choices, answers) => {
  let defaultObjects = sentencesList.map(() => []);
  defaultObjects = defaultObjects.map((obj, index) => {
    const foundItem = choices.find((item) => item.id === answers[index]);
    return [{ ...foundItem, isCorrect: true }]; // para anadirle la propiedad esCorrect al array
  });
  const remainingChoices = choices.filter(
    // los objetos restantes
    (choice) => !answers.includes(choice.id)
  );

  // Insertar los objetos restantes en el índice 0
  defaultObjects.splice(0, 0, remainingChoices);

  return defaultObjects;
};

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
  const [showResult, setShowResult] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState(() =>
    initializeShuffledChoices(sentencesList, shuffleArray, choices)
  );
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const refs = useRef({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [audios, setAudios] = useState({});
  console.log(shuffledChoices);
  const handleClickOutside = useCallback((event) => {
    if (
      Object.values(refs.current).every(
        (subRefs) =>
          subRefs.A &&
          subRefs.B &&
          !subRefs.A.contains(event.target) &&
          !subRefs.B.contains(event.target)
      )
    ) {
      setActiveIndex(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    if (isCompleted) {
      setShuffledChoices(
        initializeCompletedChoices(sentencesList, choices, answers)
      );
      setShowResult(true);
      setCompleted(true);
    } else {
      setShuffledChoices(
        initializeShuffledChoices(sentencesList, shuffleArray, choices)
      );
    }
    setLoading(false);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    choices,
    questionId,
    sentencesList,
    answers,
    isCompleted,
    shuffleArray,
    handleClickOutside,
  ]);

  const SaveAudio = async (oracion, index) => {
    if (audios[index]) {
      audios[index].play();
      return;
    }

    try {
      const audio = await convertToSpeech(oracion);
      if (audio) {
        audio.play();
        setAudios((prevAudios) => ({
          ...prevAudios,
          [index]: audio,
        }));
      }
    } catch (error) {
      console.error("Error al traducir:", error);
    }
  };

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
      const updatedChoices = [...shuffledChoices];

      if (destination.droppableId === source.droppableId) {
        updatedChoices[source.droppableId].splice(source.index, 1);
        updatedChoices[destination.droppableId].splice(destination.index, 0, {
          id: getId.id,
          title: draggableId,
        });
      } else if (
        shuffledChoices[destination.droppableId].length === 0 ||
        destination.droppableId === "0"
      ) {
        updatedChoices[source.droppableId].splice(source.index, 1);
        updatedChoices[destination.droppableId].push({
          id: getId.id,
          title: draggableId,
        });
      }
      setShuffledChoices(updatedChoices);
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
          "question",
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
    setShuffledChoices(
      initializeShuffledChoices(sentencesList, shuffleArray, choices)
    );
    setCompleted(false);
  }, [sentencesList, shuffleArray, choices]);
  console.log(shuffledChoices);
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
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  refs={refs}
                  SaveAudio={SaveAudio}
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
