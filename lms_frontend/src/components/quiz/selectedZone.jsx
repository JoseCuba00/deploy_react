import React from "react";
import { convertToSpeech } from "../actions/actions";

const SelectBlock = ({
  objects,
  ClickFunction,
  boxIndex,
  disabled,
  selectedChoices,
}) => {
  return (
    <div className="d-inline-flex">
      <span> (</span>
      {objects[boxIndex]?.map((obj, index) => {
        const isSelected = selectedChoices.some(
          (selectedChoice) => selectedChoice && selectedChoice.id === obj.id
        );
        return (
          <div className="d-flex p-0 " key={index}>
            <input
              onClick={() => ClickFunction(boxIndex, obj)}
              type="radio"
              className="btn-check"
              name={`options-outlined${boxIndex}`}
              id={`radio-${obj.id}`}
              disabled={disabled}
            />

            <label
              className={` select-quiz ${
                isSelected && `selected ${disabled && "isDisabled"}`
              } `}
              htmlFor={`radio-${obj.id}`}
            >
              {obj.title}
            </label>

            <div>{index === 2 ? <span>)</span> : <span>/</span>}</div>
          </div>
        );
      })}
    </div>
  );
};
const SelectZone = (props) => {
  console.log(props.selectedChoices);
  return (
    //onClick = {()=>convertToSpeech(obj.title)}
    <div className="ps-4">
      <h4 className="pb-4">Select the correct answer</h4>
      {props.list.map((sentence, boxIndex) => {
        const [firstPart, secondPart] = sentence.title.split("...");
        return props.isText ? (
          <React.Fragment key={boxIndex}>
            <span>&nbsp;{firstPart}</span>
            <SelectBlock
              objects={props.objects}
              ClickFunction={props.ClickFunction}
              boxIndex={boxIndex}
              disabled={props.disabled}
              selectedChoices={props.selectedChoices}
            />
            <span>{secondPart}</span>
          </React.Fragment>
        ) : (
          <div key={boxIndex}>
            <span>
              {boxIndex + 1} - &nbsp;{firstPart}
            </span>
            <SelectBlock
              objects={props.objects}
              ClickFunction={props.ClickFunction}
              boxIndex={boxIndex}
              disabled={props.disabled}
              selectedChoices={props.selectedChoices}
            />
            <span>{secondPart}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SelectZone;
