import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { convertToSpeech } from '../actions/actions'


const Container = styled.div`
    transition: background-color 0.5s ease;
    background-color: ${props => (props.isdraggingover ? 'lightgreen' : '#e0eff1')};
    width: 120px;
    height: 20px;
    display: inline-flex; // Cambiar de flex a inline-flex
    margin-bottom: 0;
    
    justify-content: center;
    align-items: center;    
    border-radius: 3px;
`;

const ContainerMain = styled.div`  
 background-color: rgb(245,245,245);
border-radius: 20px;
width: 900px;
height:100px;

padding-top: 22px;

`;

const DroppableZoneMain = (props) => {
    //onMouseDown={() => convertToSpeech(title)}
    return (
        <div className='pt-5'>


            <Droppable direction="horizontal" droppableId={props.id}   >
                {(provided, snapshot) => (
                    <ContainerMain isdraggingover={snapshot.isDraggingOver ? 'true' : ''} >
                        <ul className="object" {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex' }}>
                            {props.objects.map(({ id, title }, index) => {
                                return (
                                    <Draggable key={id} draggableId={title} index={index} >
                                        {(provided) => (
                                            <div className='pe-2'>
                                                <p ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="btn  boton-draggable "  >
                                                    {title}
                                                </p>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}

                        </ul>

                    </ContainerMain>)}

            </Droppable>
        </div>
    )
}
const DroppableBlock = ({ index, objects, disabled }) => (
    <Droppable droppableId={`${index + 1}`} className='align-self-center'>
        {(provided, snapshot) => (
            <div className='d-inline-flex' style={{ width: '120px' }}>
                <div className='dropContainer' style={{ width: '120px' }}>
                    <Container
                        isdraggingover={snapshot.isDraggingOver ? 'true' : ''}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='row'
                    >
                        {objects.map((obj, index) => (
                            <Draggable
                                key={obj.id}
                                draggableId={obj.title}
                                index={index}
                                isDragDisabled={disabled}
                            >
                                {(provided) => {
                                    const combinedStyle = {
                                        ...provided.draggableProps.style,
                                    };
                                    return (
                                        <p
                                            className={`btn boton-draggable ${disabled && 'isDisabled'}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            disabled={disabled}
                                            style={combinedStyle}
                                        >
                                            {obj.title}
                                        </p>
                                    );
                                }}
                            </Draggable>
                        ))}
                        <div style={{ display: 'none' }}>{provided.placeholder}</div>
                    </Container>
                </div>
            </div>
        )}
    </Droppable>
);


const DroppableZoneSentence = (props) => {
    //onMouseDown={() => convertToSpeech(obj.title)}
    console.log(props)
    return (
        <div className='ps-4'>
            <h4 className='pb-2'>Place the words in their correct place by dragging it</h4>

            {props.list.map((sentence, index) => {
                const [firstPart, secondPart] = sentence.title.split('...');
                return (
                    props.isText ? (
                        <React.Fragment key={index}>
                            <span>&nbsp;{firstPart}</span>
                            <DroppableBlock
                                index={index}
                                objects={props.objects[index + 1]}
                                disabled={props.disabled}
                            />
                            <span>{secondPart}</span>
                        </React.Fragment>
                    ) : (
                        <div key={index}>
                            <span>{index + 1}-&nbsp;{firstPart}</span>
                            <DroppableBlock
                                index={index}
                                objects={props.objects[index + 1]}
                                disabled={props.disabled}
                            />
                            <span>{secondPart}</span>
                        </div>
                    )
                );
            })}


        </div>
    )
}
export { DroppableZoneMain, DroppableZoneSentence } 
