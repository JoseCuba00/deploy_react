import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { convertToSpeech } from "../actions/actions";
import HighlightFrase from "./HighlightFrase";
import { Button } from "antd/es/radio";
const Container = styled.div`
  position: relative;
  top: 1px;
  transition: background-color 0.5s ease;
  background-color: ${(props) =>
    props.$isdraggingover ? "lightgreen" : "#e0eff1"};
  width: 120px;
  height: 17px;
  min-height: 17px;
  display: inline-flex;
  margin-bottom: 0;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
`;

const ContainerMain = styled.div`
  background-color: #e0eff1;
  border-radius: 20px;
  width: ${(props) => (props.$isText ? "100%" : "180px")};
  ${(props) => (props.$isText ? "min-height : 60px" : "height :100%")};
  @media (max-width: 768px) {
    width: ${(props) => (props.$isText ? "100%" : "80px")};
    min-height: ${(props) => (props.$isText ? "150px" : "100%")};
  }
  display: flex; // Añadido: asegúrate de que los elementos internos no colapsen el contenedor
  justify-content: center; // Añadido: centrar elementos para evitar desplazamientos
  align-items: center; // Añadido: centrar elementos para evitar desplazamientos
`;
const DroppableZoneMain = (props) => {
  return (
    <div className="pt-5 ps-3 ">
      <Droppable
        direction={`${props.isText ? "horizontal" : "vertical"}`}
        droppableId={props.id}
      >
        {(provided) => (
          <ContainerMain $isText={props.isText}>
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: "100%" }}
              className={`pt-2 ${props.isText ? "d-flex" : "ps-4"} `}
            >
              {props.objects?.map(({ id, title }, index) => {
                return (
                  <Draggable key={id} draggableId={title} index={index}>
                    {(provided) => (
                      <div className="pe-2" style={{ height: "33px" }}>
                        <p
                          onMouseDown={() => convertToSpeech(title)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="btn boton-draggable"
                        >
                          {title}
                        </p>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              <div style={{ display: "none" }}>{provided.placeholder}</div>
            </ul>
          </ContainerMain>
        )}
      </Droppable>
    </div>
  );
};
const DroppableBlock = ({ index, objects, disabled }) => (
  <Droppable droppableId={`${index + 1}`} className="align-self-center">
    {(provided, snapshot) => (
      <div
        style={{
          display: "inline-grid",
          width: "120px",
          height: "17px",
          alignItems: "center",

          position: "relative",
        }}
      >
        <div className="dropContainer">
          <Container
            $isdraggingover={snapshot.isDraggingOver ? "true" : ""}
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`row `}
          >
            {objects?.map((obj, index) => (
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
                      onMouseDown={() => convertToSpeech(obj.title)}
                      className={`btn boton-draggable inDroppableZone ${
                        disabled && (obj.isCorrect ? "correct" : "incorrect")
                      } ${disabled && "isDisabled"}
                      `}
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
            <div style={{ display: "none" }}>{provided.placeholder}</div>
          </Container>
        </div>
      </div>
    )}
  </Droppable>
);

const DroppableZoneSentence = (props) => {
  return (
    <div className="ps-4" style={{ padding: "3%" }}>
      <h4 className="pb-2">
        Place the words in their correct place by dragging it
      </h4>

      {props.list.map((sentence, index) => {
        const [firstPart, secondPart] = sentence.title.split("...");
        return props.isText ? (
          <React.Fragment key={index}>
            <span>
              &nbsp;
              {
                <HighlightFrase
                  personalized_class={"is-drag"}
                  index={`${index}-A`}
                  oracion={firstPart}
                  activeIndex={props.activeIndex}
                  setActiveIndex={props.setActiveIndex}
                  ref={(el) => {
                    if (!props.refs.current[index])
                      props.refs.current[index] = {};
                    props.refs.current[index].A = el; // Almacena la referencia para 'B'
                  }}
                  SaveAudio={props.SaveAudio}
                />
              }
            </span>
            <DroppableBlock
              index={index}
              objects={props.objects[index + 1] || []}
              disabled={props.disabled}
            />
            <HighlightFrase
              personalized_class={"is-drag"}
              index={`${index}-B`}
              oracion={secondPart}
              activeIndex={props.activeIndex}
              setActiveIndex={props.setActiveIndex}
              ref={(el) => {
                if (!props.refs.current[index]) props.refs.current[index] = {};
                props.refs.current[index].B = el; // Almacena la referencia para 'B'
              }}
              SaveAudio={props.SaveAudio}
            />
          </React.Fragment>
        ) : (
          <div key={index}>
            <span>
              {index + 1}-&nbsp;
              {
                <HighlightFrase
                  personalized_class={"is-drag"}
                  index={`${index}-A`}
                  oracion={firstPart}
                  activeIndex={props.activeIndex}
                  setActiveIndex={props.setActiveIndex}
                  ref={(el) => {
                    if (!props.refs.current[index])
                      props.refs.current[index] = {};
                    props.refs.current[index].A = el; // Almacena la referencia para 'B'
                  }}
                  SaveAudio={props.SaveAudio}
                />
              }
            </span>
            <DroppableBlock
              index={index}
              objects={props.objects[index + 1] || []}
              disabled={props.disabled}
            />
            <HighlightFrase
              personalized_class={"is-drag"}
              index={`${index}-B`}
              oracion={secondPart}
              activeIndex={props.activeIndex}
              setActiveIndex={props.setActiveIndex}
              ref={(el) => {
                if (!props.refs.current[index]) props.refs.current[index] = {};
                props.refs.current[index].A = el; // Almacena la referencia para 'B'
              }}
              SaveAudio={props.SaveAudio}
            />
          </div>
        );
      })}
    </div>
  );
};

export { DroppableZoneMain, DroppableZoneSentence };
