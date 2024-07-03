import React, { useEffect } from 'react'
import { useState } from 'react';
import { QuizZone } from './quizZone';
import { QuizBottons } from '../quizBottons';
import { ChangeData } from '../actions/actions'


const RadioQuiz = ({ sentencesList, choices, answers, setCurrentQuestion, shuffleArray, questionId, setQuestionData, isCompleted, currentQuestion, totalQuestions, setTopicData, assignments_id }) => {

    const [answerId, setAnswerId] = useState(null);
    const [IsCorrect, SetIsCorrect] = useState(null);
    const [ShowResult, SetShowResult] = useState(false);
    const [shuffledChoices, setShuffledChoices] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (isCompleted) {
            // Esperar a que el componente se monte y los inputs de radio estén disponibles en el DOM
            setAnswerId(answers[0])
            SetShowResult(true);
            setCompleted(true);
            setLoading(false);
        }
        setShuffledChoices(shuffleArray(choices));
    }, [isCompleted,shuffleArray, choices]);


    const onAnswerClick = (id) => {
        console.log(id)
        console.log(answers[0])
        setAnswerId(id);
        if (id === answers[0]) {
            SetIsCorrect(true)
        }
        else {
            SetIsCorrect(false)
        }
    }

    const onClickSubmit = () => {

        SetShowResult(true)
        setCompleted(IsCorrect)

        isCompleted === false && ChangeData(setQuestionData, setTopicData, questionId, assignments_id)

    }

    const onClickNext = () => {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);

    }
    const onClickReset = () => {
        setAnswerId(null)
        document.querySelectorAll('input[type=radio]').forEach(el => el.checked = false);
        SetShowResult(false);
        setShuffledChoices(shuffleArray(choices))
        setCompleted(false);
    };
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
                ) : (
                    <div className="container">
                        <QuizZone
                            title={sentencesList}
                            choices={shuffledChoices}
                            selectedAnswer={answerId}
                            IsCorrect={ShowResult ? IsCorrect : null}
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

                )}
            </div>
        </div>
    );
}

export default RadioQuiz;