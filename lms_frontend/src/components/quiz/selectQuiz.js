import React, { useState, useMemo, useCallback, useEffect } from 'react';
import SelectZone from './selectedZone';
import { ChangeData } from '../actions/actions'
import { QuizBottons } from '../quizBottons';
// Usar un estado local para las elecciones seleccionadas
const useSelected = () => {
  const [selected, setSelected] = useState([]);
  const updateSelected = useCallback((box, obj, answers) => {
    setSelected(prev => {
      console.log(obj)
      let isCorrect = obj.id === answers[box]
      const newSelected = [...prev]; // Crear un nuevo array en lugar de mutar el estado directamente
      newSelected[box] = { id: obj.id, isCorrect: isCorrect };
      return newSelected;
    });
  }, []);
  const resetSelected = useCallback(() => {
    setSelected([]); // Restablecer el estado a un array vacío
  }, []);
  return [selected, updateSelected, resetSelected];
};

const SelectQuiz = ({ sentencesList, choices, answers, setCurrentQuestion, questionId, setQuestionData, isCompleted, currentQuestion, totalQuestions, setTopicData, assignments_id }) => {
  const chunkSize = 3;

  // Memoizar la transformación de choices para evitar cálculos innecesarios
  const choicesTransform = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < choices.length; i += chunkSize) {
      chunks.push(choices.slice(i, i + chunkSize)); // Poner los datos en la siguiente estructura [[{},{},{}],[{},{},{}]]
    }
    return chunks;
  }, [choices]);

  const [showResult, setShowResult] = useState(false);
  const [selected, updateSelected, resetSelected] = useSelected();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isCompleted) {
      // Esperar a que el componente se monte y los inputs de radio estén disponibles en el DOM
      setTimeout(() => {
        answers.map((answer, index) => {
          document.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (Number(radio.id) === answer) {
              console.log(radio.id)
              radio.checked = true
            }
          });
        })

      }, 0);
      setShowResult(true);
      setCompleted(true);
      setLoading(false);
    }
  }, [isCompleted]);

  const onAnswerClick = useCallback((box, obj) => {
    console.log('input cliceado')
    updateSelected(box, obj, answers);
    console.log(selected);
  }, [selected, updateSelected, answers]);

  const onClickSubmit = () => {
    let score = 0
    selected.forEach((obj, index) => {
      if (obj.isCorrect) {
        score++
      }
    })
    if (score === answers.length) {
      setCompleted(true)
      isCompleted === false && ChangeData(setQuestionData, setTopicData, questionId, assignments_id)
    }
    setShowResult(true);
  };

  const onClickNext = useCallback(() => {
    setCurrentQuestion(prevQuestion => prevQuestion + 1);
  }, [setCurrentQuestion]);

  const onClickReset = () => {
    document.querySelectorAll('input[type=radio]').forEach(el => el.checked = false);
    resetSelected();
    setShowResult(false);
    setCompleted(false)
  };

  useEffect(() => {
    if (choicesTransform.length > 0) {
      setLoading(false);
    }
  }, [choicesTransform]);

  return (
    <div className='QuestionsContainer'>
      <div className='text'>
        {loading ? (
          <p>Loading</p> // Muestra el símbolo de carga
        ) : (
          <div className="container">
            <SelectZone
              objects={choicesTransform}
              ClickFunction={onAnswerClick}
              list={sentencesList}
              selectedChoices={showResult ? selected : []}
              disabled={showResult}
              answers={answers}
             
            />
            < QuizBottons
              buttonName={showResult ? (completed ? 'Solve again' : 'Try again') : 'Submit'}
              completed={showResult ? completed : null}
              onClickButton={showResult ? onClickReset : onClickSubmit}
              onClickNext={onClickNext}
              Next={currentQuestion === totalQuestions} />
          </div>

        )}
      </div>
    </div>
  );
};

export default React.memo(SelectQuiz);
