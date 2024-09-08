import React from "react";
import { Result } from "antd";

const QuizBottons = (props) => {
  return (
    <div className="d-flex justify-content-between pt-5">
      <div className="d-flex align-items-center">
        <div>
          <button onClick={props.onClickButton} className="botons-next-submit">
            {props.buttonName}
          </button>
        </div>
        {props.completed !== null &&
          (props.completed ? (
            <div className="d-flex ps-4">
              <Result status="success" />
              <span className="ps-2" style={{ fontWeight: "600" }}>
                Correct
              </span>
            </div>
          ) : (
            <div className="d-flex ps-4 align-items-center">
              <Result status="error" />
              <span className="ps-2 " style={{ fontWeight: "600" }}>
                Incorrect
              </span>
            </div>
          ))}
      </div>
      <div>
        {!props.Next && (
          <button onClick={props.onClickNext} className="botons-next-submit">
            Next
          </button>
        )}
      </div>
    </div>
  );
};
export { QuizBottons };
