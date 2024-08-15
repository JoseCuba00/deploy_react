import React from "react";
import { convertToSpeech } from "../actions/actions";

const CheckBoxZone = (props) => {
  return (
    <div className="d-flex flex-column ">
      <div className="pt-4">
        {props.choices.map((choice, index) => {
          const isSelected = props.selectedChoices.some(
            (selectedChoice) => selectedChoice.id === choice.id
          );
          return (
            <div className="pb-2" key={index}>
              <div
                className={`ps-2 form-check boton-quiz ${
                  isSelected && `selected ${props.disabled && "isDisabled"}`
                }`}
                key={choice.id}
                onClick={(e) => {
                  if (!props.disabled) {
                    props.onAnswerClick(choice, choice.id);
                    convertToSpeech(choice.title);
                  }
                }}
              >
                <input
                  key={choice.id}
                  className="checkbox-quiz"
                  type="checkbox"
                  id={`checkbox-${choice.id}`}
                  disabled={props.disabled}
                  checked={isSelected ? true : false}
                ></input>
                <label
                  className="form-check-label"
                  style={{ fontWeight: "600", paddingLeft: "40px" }}
                >
                  {choice.title}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { CheckBoxZone };
