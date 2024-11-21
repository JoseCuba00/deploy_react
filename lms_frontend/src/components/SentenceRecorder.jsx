import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useEffect,
} from "react";
import { AiOutlineAudio, AiOutlineClose } from "react-icons/ai";
import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
import { convertToSpeech } from "./actions/actions";
import { MdOutlineTranslate, MdOutlinePlayCircleOutline } from "react-icons/md";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Importa los estilos de Tippy.js
import "tippy.js/themes/light.css"; // Opcional: Puedes usar diferentes temas

const SentenceRecorder = ({
  sentence,
  showPlayButton,
  playSize,
  cancelSize,
  microphoneSize,

  showRecordButton,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audios, setAudios] = useState(null); // variable donde se van a guardar los audios
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Referencia al objeto de audio

  const [translations, setTranslations] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errorIndex, setErrorIndex] = useState(null);
  const ref = useRef({});
  const [activeTranslate, setActiveTranslate] = useState(false);

  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setActiveTranslate(false);
      }
    },
    [setActiveTranslate]
  );

  useEffect(() => {
    if (showPlayButton) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, showPlayButton]);

  let tooltipContent = null;

  if (activeTranslate) {
    if (loadingIndex) {
      tooltipContent = <span>Traduciendo...</span>;
    } else if (errorIndex) {
      tooltipContent = <span style={{ color: "red" }}>Error al traducir.</span>;
    } else if (translations) {
      tooltipContent = <span>{translations}</span>;
    }
  }

  const SaveAudio = async (oracion) => {
    if (audios) {
      audios.play();
      return;
    }

    try {
      const audio = await convertToSpeech(oracion);
      if (audio) {
        audio.play();
        setAudios(() => audio);
      }
    } catch (error) {
      console.error("Error al traducir:", error);
    }
  };

  // Inicia la grabación de audio
  const handleStartRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mimeType = "audio/webm";

      // Verifica si el MIME type es soportado
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn(`${mimeType} no es soportado, usando otro formato.`);
        // Puedes cambiar a 'audio/ogg' u otro formato soportado
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });

        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        // Limpia el objeto de audio existente si lo hay
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        // Detiene todas las pistas del stream para liberar el micrófono
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      alert(
        "No se pudo acceder al micrófono. Por favor, verifica los permisos."
      );
      setIsRecording(false);
    }
  };

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
    },

    [activeTranslate, translations]
  );
  // Detiene la grabación de audio
  const handleStopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Reproduce o pausa el audio grabado
  const handlePlayPause = () => {
    if (!audioRef.current) {
      // Si no existe, crea un nuevo objeto de audio
      audioRef.current = new Audio(audioURL);
      // Agrega un listener para cuando el audio termine
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Cancela y elimina la grabación existente
  const handleCancelRecording = () => {
    setAudioURL("");

    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Botón de grabar */}

        {showRecordButton && !isRecording && !audioURL && (
          <AiOutlineAudio
            onClick={handleStartRecording}
            size={microphoneSize}
            style={{ cursor: "pointer" }}
            title="Записать"
          />
        )}

        {/* Botón de detener grabación */}
        {isRecording && (
          <div className="record-button" onClick={handleStopRecording}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className={`icon ${isRecording ? "recording" : ""}`}
            >
              <circle
                cx="256"
                cy="256"
                r="200"
                fill="none"
                stroke="currentColor"
                strokeWidth="48"
                color="red"
              />

              <circle
                cx="255"
                cy="255"
                r="70"
                fill="red"
                stroke="currentColor"
                strokeWidth="48"
                color="red"
                className="inner-square"
              />
            </svg>
          </div>
        )}

        {/* Botones de reproducir y cancelar grabación */}
        {audioURL && !isRecording && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Botón X */}
            <AiOutlineClose
              onClick={handleCancelRecording}
              size={cancelSize}
              color="black"
              style={{
                cursor: "pointer",
                position: "absolute",
                left: "-30px", // Ajusta según necesites
                top: "50%",
                transform: "translateY(-50%)",
              }}
              title="отменить запись"
            />
            {/* Botón Play/Pause */}
            {isPlaying ? (
              <IoPauseOutline
                onClick={handlePlayPause}
                size={playSize}
                style={{ cursor: "pointer" }}
                title="Pausar reproducción"
              />
            ) : (
              <IoPlayOutline
                onClick={handlePlayPause}
                size={playSize}
                style={{ cursor: "pointer" }}
                title="Reproducir grabación"
              />
            )}
          </div>
        )}
      </div>
      {showPlayButton && (
        <div className="d-flex pb-4 ps-2   ">
          <span>
            <MdOutlinePlayCircleOutline
              size={playSize}
              onClick={async () => {
                SaveAudio(sentence);
              }}
              style={{ cursor: "pointer" }}
              title="reproducir el audio"
            />
          </span>
          <span className="ps-2">{sentence}</span>
          <Tippy
            content={tooltipContent || ""}
            visible={activeTranslate}
            placement="top"
            theme="light"
            sticky={true}
          >
            <span className="ms-2" ref={ref}>
              <MdOutlineTranslate
                onClick={(event) => handleClickTranslate(sentence, event)}
                size={20}
                style={{ cursor: "pointer" }}
              />
            </span>
          </Tippy>
        </div>
      )}
    </div>
  );
};

export default SentenceRecorder;
