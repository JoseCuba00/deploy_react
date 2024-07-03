import React from 'react';
import { convertToSpeech } from '../actions/actions'

const QuizZone = (props) => {
    //convertToSpeech(choice.title);
    return (
        <div >
            <div className="d-flex flex-column">
                <h4>Select the correct answer</h4>

                <h6 className='d-flex align-items-center' style={{ 'font-weight': '400' }}>
                    <div>
                        <label onClick={() => convertToSpeech(props.title[0].title)} className="btn-sm btn-light ">
                            🔊
                        </label>
                    </div>
                    <div className='pl-2'>
                        {props.title[0].title}
                    </div>
                </h6>

                <div className="pt-4" >
                    {
                        props.choices ? (
                            props.choices.map((choice, index) => (
                                <div className='pb-2'>

                                    <div
                                        className={` ps-2 form-check boton-quiz ${props.selectedAnswer === choice.id ? 'selected' : ''}`}
                                        key={choice.id}
                                        onClick={() => {
                                            if (!props.disabled) {
                                                props.onAnswerClick(choice.id);
                                                document.getElementById(`radio-${choice.id}`).click();
                                                
                                            }
                                        }}
                                    >
                                        {console.log(choice.id)}
                                        <input

                                            key={choice.id}
                                            className="radio-quiz "
                                            type="radio"
                                            id={`radio-${choice.id}`}
                                            name="flexRadioDefdivt"
                                            disabled={props.disabled}
                                            checked={props.selectedAnswer === choice.id ? true:false }
                                        ></input>
                                        <label

                                            className="form-check-label "
                                            htmlFor={`radio-${choice.id}`}
                                            style={{ 'font-weight': '600', 'padding-left': '40px' }}
                                        >
                                            {choice.title}
                                        </label>
                                    </div>
                                </div>
                            ))) : (<div><p>Loading</p></div>)
                    }
                </div>


            </div>
        </div>
    )
}

export { QuizZone }
