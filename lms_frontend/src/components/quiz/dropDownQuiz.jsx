import React, { useState, useEffect, useCallback, useRef } from "react";
import DropdownZone from "./dropDownZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
import { convertToSpeech } from "../actions/actions";
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
  const [activeIndex, setActiveIndex] = useState(null);
  const [audios, setAudios] = useState({});
  const refs = useRef({}); // donde se van a guardar todas las ref de las oraciones
  const handleClickOutside = useCallback((event) => {
    // Revisamos cada elemento en refs.current
    console.log(refs);
    if (
      Object.values(refs.current).every(
        (subRefs) =>
          subRefs.A &&
          subRefs.B && // Comprobar que ambas referencias existen
          !subRefs.A.contains(event.target) && // Si el clic fue fuera de A
          !subRefs.B.contains(event.target) // Y fuera de B
      )
    ) {
      setActiveIndex(null);
    }
  }, []);
  useEffect(() => {
    const initializeQuestion = () => {
      // Se inicializan los estados ya que si se cambia de una pregunta a otra que tiene le mismo tipo los estados no cambian
      document.addEventListener("mousedown", handleClickOutside);
      SetdropDownValue(titles);
      SetShowResult(false);
      setCompleted(false);
      setShuffledChoices(shuffleChoices);
      setLoading(true);

      if (isCompleted) {
        SetdropDownValue(
          answers.map((id) => {
            const item = choices.find((item) => item.id === id);
            return item ? { ...item, isCorrect: true } : null; // Devuelve el objeto con isCorrect o null
          })
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shuffleArray, choices]);

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
          // guardar el audio para no tener que volver hacer la llamada a la api
          ...prevAudios,
          [index]: audio,
        }));
      }
    } catch (error) {
      console.error("Error al traducir:", error);
    }
  };

  const changeValue = useCallback(async (box, questionId, text) => {
    SetdropDownValue((prev) => ({
      ...prev,
      [box]: { title: text, id: questionId },
    }));
    const audio = await convertToSpeech(text);
    audio.play();
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
          "question",
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
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              refs={refs}
              SaveAudio={SaveAudio}
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
