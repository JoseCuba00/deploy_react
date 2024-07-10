import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DroppableZoneMain, DroppableZoneSentence } from './drapDropZone'
import { ChangeData } from '../actions/actions'
import { QuizBottons } from '../quizBottons';

const DragDropQuiz = ({ sentencesList, choices, answers, setCurrentQuestion, shuffleArray, questionId, setQuestionData, isCompleted, currentQuestion, totalQuestions, setTopicData, assignments_id,isText }) => {
    
    const initializeShuffledChoices = useCallback(() => {
        let defaultObjects = sentencesList.map(() => ([]));
        defaultObjects.splice(0, 0, JSON.parse(JSON.stringify(shuffleArray(choices))));
        return defaultObjects;
    },[sentencesList,choices,shuffleArray])

    const [showResult, setShowResult] = useState(false);
    const [shuffledChoices, setShuffledChoices] = useState(initializeShuffledChoices);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isCompleted) {
            let defaultObjects = sentencesList.map(() => ([]));

            defaultObjects = defaultObjects.map((obj, index) => {
                const foundItem = choices.find(item => item.id === answers[index]);
                return [foundItem]; // Envolver el resultado en un array
            });
            defaultObjects.splice(0, 0, []);
            setShuffledChoices(defaultObjects);

            setShowResult(true);
            setCompleted(true);
            setLoading(false);
        }
    }, [isCompleted, choices, answers, sentencesList]);

    const handleOnDragEnd = useCallback((result) => {
        const { destination, source, draggableId } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const getId = choices.find((objeto) => objeto.title === draggableId);

        if (result.destination.droppableId === result.source.droppableId) {
            const updatedChoices = [...shuffledChoices];
            updatedChoices[source.droppableId].splice(source.index, 1);
            updatedChoices[destination.droppableId].splice(destination.index, 0, { id: getId.id, title: draggableId });
            setShuffledChoices(updatedChoices);
        } else if (shuffledChoices[destination.droppableId].length === 0 || result.destination.droppableId === '0') {
            const updatedChoices = [...shuffledChoices];
            updatedChoices[source.droppableId].splice(source.index, 1);
            updatedChoices[destination.droppableId].push({ id: getId.id, title: draggableId });
            setShuffledChoices(updatedChoices);
        }
    }, [shuffledChoices, choices]);

    const onClickSubmit = async () => {
        let score = 0;
        let updatedChoices
        try{
            updatedChoices = shuffledChoices.map((obj, index) => {
                if (index === 0) return obj;
                let isCorrect = obj[0].id === answers[index - 1];
                
                if (isCorrect) score++;
                return [{ ...obj[0], isCorrect }];
            });
        }
        catch{
               const successAlert = () => {
            
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-popup';
            alertDiv.textContent = 'You have to fill all the empty spaces';
            document.body.appendChild(alertDiv);
        
            setTimeout(() => {
                document.body.removeChild(alertDiv);
               // Reemplaza '/otra-pagina' con la ruta a la que deseas redirigir
            }, 3000);
        }
        return successAlert()
        }


        setShuffledChoices(updatedChoices);

        if (score === answers.length) {
            setCompleted(true);
            isCompleted === false && ChangeData(setQuestionData, setTopicData, questionId, assignments_id)
        }
        setShowResult(true);
    };

    const onClickNext = useCallback(() => {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
    }, [setCurrentQuestion]);

    const onClickReset = useCallback(() => {
        setShowResult(false);
        setShuffledChoices(initializeShuffledChoices);
        setCompleted(false)
    }, [initializeShuffledChoices]);

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
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <div>
                            <div className='oraciones d-flex flex-row pt-3 row'>
                                <DroppableZoneSentence
                                    list={sentencesList}
                                    objects={shuffledChoices}
                                    disabled={showResult}
                                    isText={isText}
                                />
                            <DroppableZoneMain id={'0'} objects={shuffledChoices[0]} />
                            </div>
                            < QuizBottons
                                buttonName={showResult ? (completed ? 'Solve again' : 'Try again') : 'Submit'}
                                completed={showResult ? completed : null}
                                onClickButton={showResult ? onClickReset : onClickSubmit}
                                onClickNext={onClickNext}
                                Next={currentQuestion === totalQuestions} />

                        </div>

                        <div className="droppable-zone-main">
                            
                        </div>
                    </DragDropContext>
                )}
            </div>
        </div>
    );
};

export default DragDropQuiz;
