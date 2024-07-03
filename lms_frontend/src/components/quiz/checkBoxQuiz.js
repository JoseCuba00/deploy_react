import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import { CheckBoxZone } from './checkBoxZone'
import { ChangeData } from '../actions/actions'
import { QuizBottons } from '../quizBottons';

const CheckBoxQuiz = ({ sentencesList, choices, answers, setCurrentQuestion, shuffleArray, questionId, setQuestionData, isCompleted, currentQuestion, totalQuestions, setTopicData, assignments_id }) => {

    const initializeShuffledChoices = () => {
        return shuffleArray(choices);
    };

    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [ShowResult, SetShowResult] = useState(false);
    const [shuffledChoices, setShuffledChoices] = useState(initializeShuffledChoices);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isCompleted) {
            // Esperar a que el componente se monte y los inputs de radio estén disponibles en el DOM
            setSelectedCheckboxes(answers.map(answer=>({id:answer})))
            SetShowResult(true);
            setCompleted(true);
            setLoading(false);
        }
    }, [isCompleted, choices]);

    const onAnswerClick = useCallback((choice, id) => {
        setSelectedCheckboxes(prevSelectedCheckboxes => {
            const isAlreadySelected = prevSelectedCheckboxes.some(item => item.id === id);

            if (isAlreadySelected) {
                return prevSelectedCheckboxes.filter(item => item.id !== id); // Si el elemento ya exite "lo elimina"
            }

            const newCorrectAnswer = answers.find(answer => answer === id) ? true : false // comprueba si el elemento esta en la respuesta  
            return [...prevSelectedCheckboxes, { id, IsCorrect: newCorrectAnswer }]; // si el elemento no existe lo agriega 
        });
    }, [])

    const onClickSubmit = () => {
        let score = 0
        console.log(selectedCheckboxes)
        selectedCheckboxes.forEach((obj, index) => {
            if (obj.IsCorrect) {
                score++
            }
            else {
                score--
            }
        })
        if (score === answers.length) {

            setCompleted(true)
            isCompleted === false && ChangeData(setQuestionData, setTopicData, questionId, assignments_id)
        }
        SetShowResult(true)


    }

    const onClickNext = useCallback(() => {

        setCurrentQuestion(prevQuestion => prevQuestion + 1);
    }, []);
    const onClickReset = useCallback(() => {
        document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false); // Para deseleccionar los inputs 
        setSelectedCheckboxes([])
        SetShowResult(false);
        setShuffledChoices(shuffleArray(choices))
        setCompleted(false)
    }, []);

    useEffect(() => {
        if (shuffledChoices.length > 0) {
            setLoading(false);
        }
    }, [shuffledChoices]);

    return (


        <div className='QuestionsContainer'>
            <div className='text'>
                {loading ? (
                    <p>Loading</p> // Muestra el símbolo de carga
                ) : (<div className='container'>
                    <CheckBoxZone
                        title={sentencesList}
                        choices={shuffledChoices}
                        selectedChoices={selectedCheckboxes }
                        onAnswerClick={onAnswerClick}
                        disabled={ShowResult}
                    />
                    < QuizBottons
                        buttonName={ShowResult ? (completed ? 'Solve again' : 'Try again') : 'Submit'}
                        completed={ShowResult ? completed : null}
                        onClickButton={ShowResult ? onClickReset : onClickSubmit}
                        onClickNext={onClickNext}
                        Next={currentQuestion === totalQuestions} />
                </div>

                )}</div>
        </div>

    );
}

export default CheckBoxQuiz;