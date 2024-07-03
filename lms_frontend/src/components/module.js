import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';

const baseUrl = "http://127.0.0.1:8000"

function Module({TopicData}) {
    console.log('module')
    let { module_id } = useParams();
    const currentPath = `/module/${module_id}`


    return (

        <div className="d-flex flex-column align-items-stretch flex-shrink-0  scrollable-menu fixed" style={{background:'rgb(245,245,245)'}}>
            <div className="list-group list-group-flush fixed">
                <ul className="list-unstyled ps-0">
                    {TopicData.map((topic, indexTopic) => {
                        const collapseId = `collapse-${indexTopic}`;
                        return (
                            <li className="mb-1 border-bottom" key={topic.id}>
                                <button
                                    className="btn btn-toggle align-items-center rounded collapsed"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#${collapseId}`}
                                    aria-expanded="true"
                                    
                                >
                                    {indexTopic + 1} {topic.title}
                                </button>
                                <div className="collapse show" id={collapseId}>
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small ">

                                        {topic.assignments.map((quiz, index) => (
                                            <li key={quiz.id}>
                                                
                                                <Link to={`${currentPath}/assignments/${quiz.id}`} className="link-dark rounded assignments" >
                                                <div>
                                                
                                                <Progress type="circle" percent={(quiz.completed*100/quiz.total)} size={12} />
                                                </div>
                                                <div className='ps-2'>
                                                {String(indexTopic + 1) + "." + String(index) + "-" + quiz.title}
                                                </div>
                                                    
                                                    
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Module;










