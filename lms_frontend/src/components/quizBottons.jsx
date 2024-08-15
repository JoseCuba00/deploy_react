import React from "react";
import { Result } from "antd";

const QuizBottons = (props) => {
  return (
    <div className="d-flex justify-content-between pt-5">
      <div className="d-flex align-items-center">
        <div>
          <button
            onClick={props.onClickButton}
            className="btn btn-primary"
            style={{ background: "#341ca6", border: "1px solid transparent" }}
          >
            {props.buttonName}
          </button>
        </div>
        {props.completed !== null &&
          (props.completed ? (
            <div className="d-flex ps-4">
              <Result status="success" />
              <span className="ps-2">Correct</span>
            </div>
          ) : (
            <div className="d-flex ps-4">
              <Result status="error" />
              <span className="ps-2">Incorrect</span>
            </div>
          ))}
      </div>
      <div>
        {!props.Next && (
          <button
            onClick={props.onClickNext}
            className="btn btn-primary"
            style={{ background: "#341ca6", border: "1px solid transparent" }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
export { QuizBottons };
