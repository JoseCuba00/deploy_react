import React, { useState, useEffect, useCallback } from 'react';
import DropdownZone from './dropDownZone'
import { ChangeData } from '../actions/actions'
import { QuizBottons } from '../quizBottons';

const DropDownQuiz = ({ sentencesList, choices, answers, setCurrentQuestion, shuffleArray, questionId, setQuestionData, isCompleted, currentQuestion, totalQuestions, setTopicData, assignments_id }) => {

    const titles = sentencesList.map(() => ({ title: 'Select an item' })) // genera el array donde se van a guardar los titulos 
    const [dropDownValue, SetdropDownValue] = useState(titles)
    const [ShowResult, SetShowResult] = useState(false);
    const [shuffledChoices, setShuffledChoices] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Mezclar los objetos una vez cuando el componente se monta y guardarlo en una variable
        setShuffledChoices(shuffleArray(choices));
        if (isCompleted) {
            SetdropDownValue(answers.map(id => choices.find(item => item.id === id)))
            SetShowResult(true)
            setCompleted(true)
            setLoading(false);
        }


    }, [shuffleArray, choices]);

    const changeValue = useCallback((box, questionId, text) => {
        SetdropDownValue(prev => ({
            ...prev,
            [box]: { title: text, id: questionId, isCorrect: null },
        }))
    }, []);

    const onClickSubmit = async () => {
        let score = 0
        Object.values(dropDownValue).map((object, index) => {
            object.isCorrect = object.id === answers[index]
            if (object.isCorrect === true) {
                score++
            }
        }
        )
        if (score === answers.length) {
            setCompleted(true)

            // Cambia los datos y hace el put request
            isCompleted === false && ChangeData(setQuestionData, setTopicData, questionId, assignments_id)


        }
        SetShowResult(true)
    };

    const onClickNext = () => {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
    };
    const onClickReset = () => {
        SetShowResult(false);
        SetdropDownValue(titles)
        setShuffledChoices(shuffleArray(choices))
        setCompleted(false)
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
                ) : (<div>
                    <DropdownZone
                        sentencesList={sentencesList}
                        title={dropDownValue}
                        objects={shuffledChoices}
                        clickFunction={changeValue}
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
};

export default DropDownQuiz;