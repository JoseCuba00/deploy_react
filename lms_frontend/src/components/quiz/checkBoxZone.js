import React from 'react'
import { convertToSpeech } from '../actions/actions'

const CheckBoxZone = (props) => {
    //convertToSpeech(choice.title)
  
    return(
        <div className="d-flex flex-column" >
            <h4>Select all the correct answers</h4>

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

            <div className="pt-4">
                {
                    props.choices.map((choice, index) => {
                        const isSelected = props.selectedChoices.some(selectedChoice => selectedChoice.id === choice.id)
                        return (
                            <div className='pb-2'>
                                <div
                                    className={`ps-2 form-check boton-quiz ${isSelected ? 'selected' : ''}`}
                                    key={choice.id}
                                    onClick={() => {
                                        if (!props.disabled) {
                                        props.onAnswerClick(choice, choice.id)
                                        }
                                    }}
                                >
                                    <input
                                        key={choice.id}
                                        type="checkbox"
                                        id={choice.id}
                                        name="flexCheckboxDefault"
                                        disabled={props.disabled}
                                        checked={isSelected ? true : false}
                                    ></input>
                                    <label
                                        className="form-check-label"
                                        style={{ 'font-weight': '600', 'padding-left': '40px' }}
                                        htmlFor={choice.id}
                                    >
                                        {choice.title}
                                    </label>

                                </div>
                            </div>
                        )


                    })
                }
            </div>
        </div>



    );
}

export { CheckBoxZone };