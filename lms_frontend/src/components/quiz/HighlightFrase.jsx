import React, { useState, useCallback, forwardRef, useRef } from "react";
import { MdOutlineTranslate, MdOutlinePlayCircleOutline } from "react-icons/md";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Importa los estilos de Tippy.js
import "tippy.js/themes/light.css"; // Opcional: Puedes usar diferentes temas
import { convertToSpeech } from "../actions/actions";

const HighlightFrase = forwardRef(
  (
    {
      personalized_class,
      index,
      oracion,
      activeIndex,
      setActiveIndex,
      SaveAudio,
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState(false);
    const [translations, setTranslations] = useState(null);
    const [loadingIndex, setLoadingIndex] = useState(null);
    const [errorIndex, setErrorIndex] = useState(null);
    const [activeTranslate, setActiveTranslate] = useState(false);
    console.log(personalized_class);
    let tooltipContent = null;

    if (activeTranslate) {
      if (loadingIndex) {
        tooltipContent = <span>Traduciendo...</span>;
      } else if (errorIndex) {
        tooltipContent = (
          <span style={{ color: "red" }}>Error al traducir.</span>
        );
      } else if (translations) {
        tooltipContent = <span>{translations}</span>;
      }
    }

    const handleMouseEnter = useCallback(() => {
      setHoveredIndex(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setHoveredIndex(false);
    }, []);

    const handleClickTranslate = useCallback(
      async (oracion, event) => {
        if (activeTranslate) {
          setActiveTranslate(false);
          return;
        }
        setActiveTranslate(true);
        setErrorIndex(false);

        if (translations) {
          return;
        }

        setLoadingIndex(true);

        try {
          const response = await fetch("http://127.0.0.1:8000/translate/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: oracion,
            }),
          });

          if (!response.ok) {
            throw new Error("Error en la traducción");
          }

          const data = await response.json();
          setTranslations(data[oracion]);
        } catch (error) {
          console.error("Error al traducir:", error);
          setErrorIndex(true);
        } finally {
          setLoadingIndex(false);
        }
        event.stopPropagation();
      },

      [activeTranslate, translations]
    );

    const handleClick = useCallback(
      (event) => {
        if (activeIndex === index) {
          setActiveIndex(null);
        } else {
          setActiveIndex(index);
          setActiveTranslate(false);
          setErrorIndex(false);
        }
      },
      [activeIndex, index, setActiveIndex]
    );

    const isActive = activeIndex === index;

    return (
      <span ref={ref}>
        <span>
          <MdOutlinePlayCircleOutline
            size={20}
            onClick={() => {
              SaveAudio(oracion, index);
            }}
            className={` play_audio_icon ${
              isActive ? "show" : "block"
            } ${personalized_class}`}
          />
        </span>

        <Tippy
          content={tooltipContent || ""}
          visible={isActive && activeTranslate}
          placement="top"
          theme="light"
          sticky={true}
        >
          <span>
            <MdOutlineTranslate
              onClick={(event) => handleClickTranslate(oracion, event)}
              size={20}
              className={`translate_icon ${
                isActive ? "show" : "block"
              } ${personalized_class}`}
            />
          </span>
        </Tippy>
        <span
          key={index}
          style={{
            backgroundColor:
              hoveredIndex || isActive ? "rgb(245,245,245)" : "transparent",
            cursor: "pointer",
            color:
              activeIndex !== null && index !== activeIndex ? "gray" : "black",
            fontSize: "medium",
            paddingLeft: "4px",
            transition: "background-color 0.3s",
            borderRadius: "0px 5px 5px 0px",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {oracion}
        </span>
      </span>
    );
  }
);

export default HighlightFrase;
