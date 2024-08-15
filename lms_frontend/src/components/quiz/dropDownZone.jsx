import React from "react";
import { convertToSpeech } from "../actions/actions";
import Dropdown from "react-bootstrap/Dropdown";

const DropDownBlock = (props) => {
  const titleObject = props.title[props.boxIndex] || {
    title: "Select an item",
  }; // evita el error de que el title es indefinido

  return (
    <div className="d-inline-flex">
      <Dropdown className="d-inline-block">
        <Dropdown.Toggle
          id="dropdown-basic"
          className="pt-2 pb-3 font-italic btn-sm fixed-width-toggle"
          disabled={props.disabled}
          style={{
            background: "rgb(167, 185, 219)",
            borderRadius: "5px",
            fontWeight: "600",
          }}
        >
          {titleObject.title}
        </Dropdown.Toggle>
        <Dropdown.Menu className={`w-100 fixed-width-menu`}>
          {props.objects?.map((obj, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => {
                props.clickFunction(props.boxIndex, obj.id, obj.title);
                convertToSpeech(obj.title);
              }}
            >
              {obj.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

const DropdownZone = (props) => {
  return (
    <div className="ps-4">
      <h4 className="pb-4">Select the correct option</h4>
      {props.sentencesList?.map((sentence, boxIndex) => {
        const [firstPart, secondPart] = sentence.title.split("...");
        return props.isText ? (
          <React.Fragment key={boxIndex}>
            <span>&nbsp;{firstPart}&nbsp;</span>
            <DropDownBlock
              disabled={props.disabled}
              title={props.title}
              clickFunction={props.clickFunction}
              boxIndex={boxIndex}
              objects={props.objects}
            />
            <span>&nbsp;{secondPart}</span>
          </React.Fragment>
        ) : (
          <div key={boxIndex}>
            <span>
              {boxIndex + 1}-&nbsp;{firstPart}&nbsp;
            </span>
            <DropDownBlock
              disabled={props.disabled}
              title={props.title}
              clickFunction={props.clickFunction}
              boxIndex={boxIndex}
              objects={props.objects}
            />
            <span>&nbsp;{secondPart}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DropdownZone;
