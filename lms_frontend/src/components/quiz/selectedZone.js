import React from 'react';
import { convertToSpeech } from '../actions/actions'

const SelectZone = (props) => {

    const getColor = (choice) => {
        const selectedChoice = props.selectedChoices.find(selected => selected.id === choice.id); //Saber si la opcion esta seleccionada
        if (selectedChoice) {
            return selectedChoice.isCorrect ? 'blue' : 'red';
        }
        return '';
    };

    return (
//onClick = {()=>convertToSpeech(obj.title)} 
        <div  >
            <h4 className='pb-4'>Select the correct answer</h4>
            {
            
                props.list.map((sentence, boxIndex) => (
                    <React.Fragment key={boxIndex}>
                        <span>&nbsp;{sentence.title.split('...')[0]}</span>
                        <div className='d-inline-flex'>
                            <span> (</span>
                            {props.objects[boxIndex].map((obj, index) => (
                                <div className="d-flex p-0 " key={index}>

                                    <input onClick={() => props.ClickFunction(boxIndex, obj)} type="radio" className="btn-check" name={`options-outlined${boxIndex}`} id={`radio-${obj.id}`} disabled={props.disabled} />

                                    <label class=" select-quiz" htmlFor={`radio-${obj.id}`}
                                        
                                    >{obj.title}

                                    </label>

                                    <div>
                                        {index === 2 ? <span>)</span> : <span>/</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <span>{sentence.title.split('...')[1]}</span>
                    </React.Fragment>
                ))
            }


        </div>
    )
};

export default SelectZone;