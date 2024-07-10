import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Module from './module';
import CheckBoxQuiz from './quiz/checkBoxQuiz'
import DragDropQuiz from './quiz/DrapDropQuiz';
import DropDownQuiz from './quiz/dropDownQuiz';
import SelectQuiz from './quiz/selectQuiz';
import RadioQuiz from './quiz/quiz';
import ClickToRowQuiz from './quiz/clickToRowQuiz';
import { motion, AnimatePresence, color } from "framer-motion"

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const quizComponents = {
    1: RadioQuiz,
    2: CheckBoxQuiz,
    3: DropDownQuiz,
    4: SelectQuiz,
    5: DragDropQuiz,
    6: ClickToRowQuiz
};

function Quiz() {
    const { module_id, assignments_id } = useParams()
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionData, setQuestionData] = useState([]);
    const [TopicData, setTopicData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setCurrentQuestion(0)
            try {
                const [assignmentsRes, moduleRes] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/module/${module_id}/assignments/${assignments_id}`),
                    fetch(`http://127.0.0.1:8000/module/${module_id}`)
                ]);

                if (!assignmentsRes.ok || !moduleRes.ok) {
                    throw new Error(`HTTP error! status: ${assignmentsRes.status} ${moduleRes.status}`);
                }
                const [assignmentsData, moduleData] = await Promise.all([
                    assignmentsRes.json(),
                    moduleRes.json()
                ]);
                console.log(moduleData)
                setQuestionData(assignmentsData);
                setTopicData(moduleData);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Ошибка HTTP: " + error.message);
            }
        };
        fetchData();
    }, [assignments_id]);



    if (questionData.length === 0) {
        return <div>Loading...</div>;
    }

    let answer, choices, sentences, title, type, id, completed,isText
    try {
        const currentQuestionData = questionData[currentQuestion];
        if (currentQuestionData) {
            ({ answer, choices, completed, id, sentences, title, type,isText } = currentQuestionData);
        } else {
            throw new Error("Question data not found");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    const handleClick = (event) => {
        
        setCurrentQuestion(Number(event.target.id) - 1);
    };
//#8f8f8f
    const GetBorder = (num, obj) => {
        const isCurrentQuestion = currentQuestion === num - 1;
        const background = obj.completed ? '#5dbc4a' : 'rgb(190,200,200)';
        const color = isCurrentQuestion ? 'white':obj.completed ? 'white':'white'
        const border =  isCurrentQuestion ? '2px solid #373A40':''
        return {
            background,
            color,
            border
            
        };
    };

    const SelectedQuizComponent = quizComponents[type];


    return (
        <div >
            <div className='pt-1'>
                <AnimatePresence mode="wait">
                    {
                        <motion.div
                            initial={{
                                y: '-80%',
                                opacity: 0,
                            }}
                            animate={{
                                y: "0%",
                                opacity: 1,
                                transition: {
                                    height: {
                                        duration: 0.5,
                                    },
                                    opacity: {
                                        duration: 0.25,
                                        delay: 0.10,
                                    },
                                },
                            }}
                            transition={{ duration: 0.90 }}
                            exit={{
                                height: 0,
                                opacity: 1,
                                transition: {
                                    height: {
                                        duration: 0.4,
                                    },
                                    opacity: {
                                        duration: 0.25,
                                    },
                                    
                                },
                            }}

                        >
     
                            <nav className="navbar navbar-expand-lg navbar-light " style={{"background-color": "rgb(245,245,245)"}}>
                                <div className="container collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                                    <div className='d-flex squareFather'>
                                        {questionData.map((obj, index) => (
                                            <div
                                              
                                                onClick={ handleClick}
                                                id = {index + 1}
                                                style={GetBorder(index + 1, obj)}
                                                className='squareChild'
                                            >
                                                {currentQuestion === index ? index + 1:obj.completed? '✓':index +1}
                                            </div>
                                        ))}
                                    </div>
                                    <form className="form-inline my-2 my-lg-0">
                                    </form>
                                </div>
                            </nav>
                        </motion.div>
                    }
                </AnimatePresence>

            </div>
            <div className='d-flex'>

                <Module TopicData={TopicData} />

                <SelectedQuizComponent
                    sentencesList={sentences}
                    choices={choices}
                    answers={answer}
                    setCurrentQuestion={setCurrentQuestion}
                    currentQuestion={currentQuestion}
                    totalQuestions={questionData.length - 1}
                    shuffleArray={shuffleArray}
                    questionId={id}
                    setQuestionData={setQuestionData}
                    isCompleted={completed}
                    setTopicData={setTopicData}
                    assignments_id={assignments_id}
                    isText={isText}
                />
            </div>
        </div>

    );
}

export default Quiz;