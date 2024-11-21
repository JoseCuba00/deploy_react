import React, { useState, useEffect } from "react";
import LoadingIndicator from "../LoadingIndicator";
import { QuizBottons } from "../quizBottons";

const QuizFoto = ({
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
  const [selected, setSelected] = useState(null);
  const [IsCorrect, SetIsCorrect] = useState(null);
  const [ShowResult, SetShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeQuestion = () => {
      setSelected(null);
      SetIsCorrect(null);
      SetShowResult(false);
      setCompleted(false);
      setLoading(false);
    };

    initializeQuestion();
  }, [isCompleted, choices, answers, shuffleArray, questionId]);

  const handleClick = (id) => {
    setSelected(id);
    SetIsCorrect(id === answers[0]);
  };

  const onClickReset = () => {
    setSelected(null);

    SetShowResult(false);
    setCompleted(false);
  };

  const onClickNext = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };
  const onClickSubmit = () => {
    SetShowResult(true);
    console.log(IsCorrect);
    setCompleted(IsCorrect);

    /*
    if (!isCompleted && IsCorrect) {
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
  */
  };

  return (
    <div className="quiz">
      {loading ? (
        <LoadingIndicator /> // Muestra el símbolo de carga
      ) : (
        <>
          <h2>Which one of these is "{sentencesList[0].title}"?</h2>
          <div className="options mt-5">
            {choices.map((item) => (
              <div
                key={item.id}
                className={`option  ${
                  !ShowResult && selected === item.id ? "selected" : ""
                } ${
                  ShowResult &&
                  (selected === item.id
                    ? IsCorrect
                      ? "correct"
                      : "incorrect"
                    : "")
                }`}
                onClick={() => !ShowResult && handleClick(item.id)}
              >
                <img
                  src={`https://storage.yandexcloud.net/fotos00/${item.title}.png`} // enlace para acceder a la foto desde yandes s3
                  alt={item.title}
                />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
          <QuizBottons
            buttonName={
              ShowResult ? (completed ? "Solve again" : "Try again") : "Submit"
            }
            completed={ShowResult ? completed : null}
            onClickButton={ShowResult ? onClickReset : onClickSubmit}
            onClickNext={onClickNext}
            Next={currentQuestion === totalQuestions}
          />
        </>
      )}
    </div>
  );
};

export default QuizFoto;
