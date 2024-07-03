import React from 'react';

const QuizBottons = (props) => {
    return (
        <div className='d-flex justify-content-between pt-5'>
        <div className='d-flex align-items-center'>
            <div>
                <button onClick={props.onClickButton} className="btn btn-primary"  style={{ background: '#341ca6', border: '1px solid transparent' }}>{props.buttonName}</button>
            </div>
            {props.completed !== null && (props.completed ?
                <div className='d-flex ps-4'>
                    <img className='img_answer' src={process.env.PUBLIC_URL + '/boton-palomita.png'} alt="Correct"></img>
                    <span>Correct</span>
                </div>
                :
                <div className='d-flex ps-4'>
                    <img className='img_answer' src={process.env.PUBLIC_URL + '/boton-x.png'} alt="Incorrect"></img>
                    <span>Incorrect</span>
                </div>
            )}
        </div>
        <div>
            {!props.Next && <button onClick={props.onClickNext} className="btn btn-primary"  style={{ background: '#341ca6', border: '1px solid transparent' }}>Next</button>}
        </div>
    </div>
    )


    

}
export {QuizBottons}
