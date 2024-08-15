import { Droppable, Draggable } from "react-beautiful-dnd";
import { convertToSpeech } from "../actions/actions";

const ClickToRowZone = (props) => {
  //convertToSpeech(word.title);
  return (
    <div className={`${props.id === "row2" && "click-quiz-main"} ps-4`}>
      <Droppable droppableId={props.id} direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${
              props.id === "row1" ? "click-quiz-sentences " : "click-quiz-words"
            } `}
          >
            {props.id === "row1" && (
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#8c8c8c",
                  position: "absolute",
                  top: "50%",
                }}
              />
            )}

            {props.choices.map((word, index) => (
              <Draggable key={index} draggableId={word.title} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => {
                      if (!props.disabled) {
                        const setFrom =
                          props.id === "row1" ? props.setRow1 : props.setRow2;
                        const setTo =
                          props.id === "row1" ? props.setRow2 : props.setRow1;
                        props.onClickFunction(word, setFrom, setTo);
                        convertToSpeech(word.title);
                      }
                    }}
                    style={{
                      padding: "8px",
                      margin: "4px",
                      cursor: "pointer",
                      height: "40px",
                    }}
                    className={`click-quiz ${props.disabled && "isDisabled"}`}
                    isDragDisabled={props.disabled}
                  >
                    {word.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export { ClickToRowZone };
