import React, { useState, useRef, useCallback, useEffect } from "react";
import SelectZone from "./selectedZone";
import { ChangeData } from "../actions/actions";
import { QuizBottons } from "../quizBottons";
import LoadingIndicator from "../LoadingIndicator";
// Usar un estado local para las elecciones seleccionadas
import { convertToSpeech } from "../actions/actions";

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
  const refs = useRef({}); // donde se van a guardar todas las ref de las oraciones
  const [activeIndex, setActiveIndex] = useState(null);
  const [audios, setAudios] = useState({});

  const updateSelected = (box, obj, answers) => {
    if (!obj) return; // Prevent error if obj is undefined
    setSelected((prev) => {
      let isCorrect = obj.id === answers[box];
      const newSelected = [...prev];
      newSelected[box] = { id: obj.id, isCorrect: isCorrect };
      return newSelected;
    });
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const initializeQuestion = () => {
      if (isCompleted) {
        setSelected(answers.map((answer) => ({ id: answer, isCorrect: true })));
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
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    };

    initializeQuestion();
  }, [isCompleted, choices, answers]);

  const onAnswerClick = async (box, obj) => {
    updateSelected(box, obj, answers);
    const audio = await convertToSpeech(obj.title);
    audio.play();
  };
  console.log(selected);
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
          "questions",
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
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              refs={refs}
              SaveAudio={SaveAudio}
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
