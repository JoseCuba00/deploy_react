import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdOutlineTranslate, MdOutlinePlayCircleOutline } from "react-icons/md";
import "tippy.js/dist/tippy.css"; // Importa los estilos de Tippy.js
import "tippy.js/themes/light.css"; // Opcional: Puedes usar diferentes temas
import HighlightFrase from "./HighlightFrase";
import SentenceRecorder from "../SentenceRecorder";
import { convertToSpeech } from "../actions/actions";

const Text = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [audios, setAudios] = useState({});
  const texto =
    "Vamos a ver en primer lugar cómo se llaman los objetos de clase en el español de España (algunos nombres son diferentes en otros países de habla hispana).Normalmente los alumnos llevan a clase todo lo que necesitan dentro de una mochila, en la que pueden guardar libros, cuadernos y diccionarios.Además, para escribir pueden utilizar un bolígrafo, un lápiz, unas pinturas, una goma de borrar, un sacapuntas y un rotulador.Todos estos objetos se pueden guardar dentro de un estuche junto con otras cosas útiles, como una regla y unas tijeras.Cada alumno tiene una silla y una mesa. Y el profesor se coloca en la parte delantera de la clase junto a la pizarra. En ella escribe las explicaciones con una tiza o con un rotulador y cuando acaba las borra con el borrador.En la mesa del profesor puede haber un ordenador y una impresora. Y al lado normalmente hay una papelera para tirar la basura.Dentro de las clases o aulas, normalmente hay también estanterías y armarios para guardar libros y otros materiales. Y en las paredes se pueden colocar un reloj o un mapa";

  const oraciones = texto
    .match(/[^.!?]+[.!?]?/g)
    .map((oracion) => oracion.trim())
    .filter((oracion) => oracion.length > 0);

  const refs = useRef([]); // donde se van a guardar todas las ref de las oraciones

  const SaveAudio = async (oracion, index) => {
    if (audios[index]) {
      audios[index].play();
      return;
    }

    try {
      const audio = await convertToSpeech(oracion);
      if (audio) {
        audio.play();
        setAudios((prevAudios) => ({
          // guardar el audio para no tener que volver hacer la llamada a la api
          ...prevAudios,
          [index]: audio,
        }));
      }
    } catch (error) {
      console.error("Error al traducir:", error);
    }
  };

  const handleClickOutside = useCallback((event) => {
    // Función que "limpia" la pantalla al dar clic afuera de la oración
    if (refs.current.every((ref) => ref && !ref.contains(event.target))) {
      setActiveIndex(null);
    }
  }, []);

  useEffect(() => {
    // Añadir el event listener al montar el componente
    document.addEventListener("mousedown", handleClickOutside);
    console.log("Añado un listener");

    // Eliminar el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      console.log("Elimino un listener");
    };
  }, []);

  return (
    <>
      <div className="text_box pt-3">
        <div className="w-100 d-flex  flex-column justify-content-center align-items-center pb-3">
          <img
            src={`https://storage.yandexcloud.net/fotos00/${"rb_2399"}.png`} // enlace para acceder a la foto desde yandes s3
            alt={"rb_2399"}
            className="text_img"
          />
          <h3>El cole</h3>
        </div>

        {oraciones.map((oracion, index) => {
          return (
            <React.Fragment key={index}>
              <span
                style={{ position: "relative" }}
                className={`${index === 0 && "first_sentence"}`}
              >
                <HighlightFrase
                  personalized_class={"is-text"}
                  index={index}
                  oracion={oracion}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  ref={(el) => (refs.current[index] = el)}
                  SaveAudio={SaveAudio}
                />
              </span>
            </React.Fragment>
          );
        })}
      </div>
      <div className="bottom_panel">
        <MdOutlinePlayCircleOutline size={30} className="bottom_play_icon" />
        <SentenceRecorder
          showPlayButton={false}
          showRecordButton={true}
          playSize={28}
          cancelSize={24}
          microphoneSize={28}
        />
      </div>
    </>
  );
};

export default Text;
