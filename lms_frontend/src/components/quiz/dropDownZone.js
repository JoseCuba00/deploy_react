import React, { useState } from 'react';
import { convertToSpeech } from '../actions/actions'
import Dropdown from 'react-bootstrap/Dropdown';

const DropdownZone = (props) => {

    return (
        <div>
            <h4 className='pb-4'>Select the correct option</h4>
            {props.sentencesList.map((sentence, boxIndex) => (
                <React.Fragment key={boxIndex}>
                    <span>&nbsp;{sentence.title.split('...')[0]}&nbsp;</span>
                    <div className='d-inline-flex'>
                        <Dropdown className="d-inline-block" >
                            <Dropdown.Toggle  id="dropdown-basic" className='pt-2 pb-3 font-italic btn-sm fixed-width-toggle' disabled={props.disabled}  style={{background:'rgb(167, 185, 219)','border-radius': '5px'}}>
                                {props.title[boxIndex]['title']}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100 fixed-width-menu">
                                {props.objects.map((obj, index) => (
                                    <Dropdown.Item onClick={(e) => {props.clickFunction(boxIndex, obj.id, obj.title)
                                                                    convertToSpeech(obj.title)
                                    }}>{obj.title}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <span>&nbsp;{sentence.title.split('...')[1]}</span>
                </React.Fragment>
            ))}

        </div>


    );
};

export default DropdownZone;