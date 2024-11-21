import React from "react";
import { convertToSpeech } from "../actions/actions";
import HighlightFrase from "./HighlightFrase";
import styled from "styled-components";

const Label = styled.label`
  position: relative;
  background-color: "#e0eff1";
`;

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
        const isCorrect =
          disabled &&
          selectedChoices.some(
            (selectedChoice) => selectedChoice && selectedChoice.id === obj.id
          )
            ? selectedChoices.find(
                (selectedChoice) => selectedChoice.id === obj.id
              ).isCorrect
              ? "correct"
              : "incorrect"
            : "";

        return (
          <div className="d-flex p-0 " key={index}>
            <input
              onClick={async () => {
                ClickFunction(boxIndex, obj);
              }}
              type="radio"
              className="btn-check"
              name={`options-outlined${boxIndex}`}
              id={`radio-${obj.id}`}
              disabled={disabled}
            />

            <Label
              $isselected={isSelected}
              $disabled={disabled}
              className={`select-quiz ${
                !disabled && isSelected && `selected`
              } ${disabled && "isDisabled"} ${isCorrect}`}
              htmlFor={`radio-${obj.id}`}
            >
              {obj.title}
            </Label>

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
            <HighlightFrase
              personalized_class={"not-text"}
              index={`${boxIndex}-A`}
              oracion={firstPart}
              activeIndex={props.activeIndex}
              setActiveIndex={props.setActiveIndex}
              ref={(el) => {
                if (!props.refs.current[boxIndex])
                  props.refs.current[boxIndex] = {};
                props.refs.current[boxIndex].A = el; // Almacena la referencia para 'B'
              }}
              SaveAudio={props.SaveAudio}
            />
            <SelectBlock
              objects={props.objects}
              ClickFunction={props.ClickFunction}
              boxIndex={boxIndex}
              disabled={props.disabled}
              selectedChoices={props.selectedChoices}
            />
            <HighlightFrase
              personalized_class={"not-text"}
              index={`${boxIndex}-B`}
              oracion={secondPart}
              activeIndex={props.activeIndex}
              setActiveIndex={props.setActiveIndex}
              ref={(el) => {
                if (!props.refs.current[boxIndex])
                  props.refs.current[boxIndex] = {};
                props.refs.current[boxIndex].B = el; // Almacena la referencia para 'B'
              }}
              SaveAudio={props.SaveAudio}
            />
          </React.Fragment>
        ) : (
          <div key={boxIndex}>
            <span>
              {boxIndex + 1} - &nbsp;
              {
                <HighlightFrase
                  personalized_class={"not-text"}
                  index={`${boxIndex}-A`}
                  oracion={firstPart}
                  activeIndex={props.activeIndex}
                  setActiveIndex={props.setActiveIndex}
                  ref={(el) => {
                    if (!props.refs.current[boxIndex])
                      props.refs.current[boxIndex] = {};
                    props.refs.current[boxIndex].A = el; // Almacena la referencia para 'B'
                  }}
                  SaveAudio={props.SaveAudio}
                />
              }
            </span>
            <SelectBlock
              objects={props.objects}
              ClickFunction={props.ClickFunction}
              boxIndex={boxIndex}
              disabled={props.disabled}
              selectedChoices={props.selectedChoices}
            />
            <HighlightFrase
              personalized_class={"not-text"}
              index={`${boxIndex}-B`}
              oracion={secondPart}
              activeIndex={props.activeIndex}
              setActiveIndex={props.setActiveIndex}
              ref={(el) => {
                if (!props.refs.current[boxIndex])
                  props.refs.current[boxIndex] = {};
                props.refs.current[boxIndex].B = el; // Almacena la referencia para 'B'
              }}
              SaveAudio={props.SaveAudio}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SelectZone;
