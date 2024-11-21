import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import HighlightFrase from "./HighlightFrase";

const DropDownBlock = (props) => {
  const titleObject = props.title[props.boxIndex] || {
    title: "Select an item",
  };

  // Determina las clases para el Dropdown.Toggle
  let toggleClass = "dropdown-toggle";
  if (titleObject.hasOwnProperty("isCorrect")) {
    toggleClass += titleObject.isCorrect === true ? " correct" : " incorrect";
  }

  return (
    <div className="d-inline-flex">
      <Dropdown className="d-inline-block">
        <Dropdown.Toggle
          id="dropdown-basic"
          className={`pt-2 pb-3 font-italic btn-sm fixed-width-toggle ${toggleClass}`}
          disabled={props.disabled}
        >
          {titleObject.title}
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100 fixed-width-menu">
          {props.objects?.map((obj, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => {
                props.clickFunction(props.boxIndex, obj.id, obj.title);
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
            <HighlightFrase
              personalized_class={"not-text"}
              index={`${boxIndex}-A`}
              oracion={firstPart}
              activeIndex={props.activeIndex}
              setActiveIndex={props.setActiveIndex}
              ref={(el) => {
                if (!props.refs.current[boxIndex])
                  props.refs.current[boxIndex] = {};
                props.refs.current[boxIndex].A = el; // Almacena la referencia para 'A'
              }}
              SaveAudio={props.SaveAudio}
            />

            <DropDownBlock
              disabled={props.disabled}
              title={props.title}
              clickFunction={props.clickFunction}
              boxIndex={boxIndex}
              objects={props.objects}
            />
            <span>
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
            </span>
          </React.Fragment>
        ) : (
          <div key={boxIndex}>
            <span>
              {boxIndex + 1}-&nbsp;
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
                    props.refs.current[boxIndex].A = el; // Almacena la referencia para 'A'
                  }}
                  SaveAudio={props.SaveAudio}
                />
              }
              &nbsp;
            </span>
            <DropDownBlock
              disabled={props.disabled}
              title={props.title}
              clickFunction={props.clickFunction}
              boxIndex={boxIndex}
              objects={props.objects}
            />
            <span>
              &nbsp;
              {
                <HighlightFrase
                  personalized_class={"not-text"}
                  index={`${boxIndex}-B`}
                  oracion={secondPart}
                  activeIndex={props.activeIndex}
                  setActiveIndex={props.setActiveIndex}
                  ref={(el) => {
                    if (!props.refs.current[boxIndex])
                      props.refs.current[boxIndex] = {}; // Si no existe el ref de esa oracion o caja , lo crea
                    props.refs.current[boxIndex].B = el; // Almacena la referencia para 'B' de esa oracion o caja
                  }}
                  SaveAudio={props.SaveAudio}
                />
              }
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default DropdownZone;
