import React from "react";
import { convertToSpeech } from "../actions/actions";

const QuizZone = (props) => {
  return (
    <div className="d-flex flex-column">
      <div className="pt-4">
        {props.choices ? (
          props.choices.map((choice, index) => (
            <div className="pb-2" key={index}>
              <div
                className={` ps-2 form-check boton-quiz  ${
                  props.selectedAnswer === choice.id
                    ? `selected ${props.disabled && "isDisabled"}`
                    : ""
                }`}
                key={choice.id}
                onClick={() => {
                  if (!props.disabled) {
                    props.onAnswerClick(choice.id);
                    convertToSpeech(choice.title);
                  }
                }}
              >
                <input
                  key={choice.id}
                  className="radio-quiz "
                  type="radio"
                  id={`radio-${choice.id}`}
                  disabled={props.disabled}
                  checked={props.selectedAnswer === choice.id ? true : false}
                ></input>
                <label
                  className="form-check-label "
                  style={{ fontWeight: "600", paddingLeft: "40px" }}
                >
                  {choice.title}
                </label>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>Loading</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { QuizZone };
