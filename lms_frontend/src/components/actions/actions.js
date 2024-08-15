import axios from "axios";

const putRequestComplete = async (path, value) => {
  let response = await fetch(`http://127.0.0.1:8000/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: value }),
    credentials: "include",
  });
  if (response.ok) {
    let json = await response.json();
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
};
const ChangeData = async (
  setQuestionData,
  setTopicData,
  questionId,
  assignments_id,
  userId,
  destiny
) => {
  setQuestionData((prevQuestionData) =>
    prevQuestionData.map((question) =>
      question.id === questionId ? { ...question, completed: true } : question
    )
  );
  //questions_update
  putRequestComplete(`${destiny}/${questionId}`, true); // Poner el completed a la pregunta

  setTopicData((Topic) => {
    // Sumarle 1 al assignment
    let array = Topic.map((topic) => {
      return {
        ...topic,
        assignments: topic.assignments.map((assignment) => {
          if (assignment.assignments.id === Number(assignments_id)) {
            putRequestComplete(
              `assignments/${assignments_id}?student_id=${userId}`,
              assignment.completed + 1
            );
            return { ...assignment, completed: assignment.completed + 1 };
          } else {
            return assignment;
          }
        }),
      };
    });

    return array;
  });
};

const convertToSpeech = async (text, enableAnimation, setIsPlaying) => {
  console.log("Me activo");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/convert/",
      { text },
      {
        responseType: "arraybuffer",
        credentials: "include",
      }
    );
    if (response.status === 204) {
      console.log("No content available to play.");
      return; // No hay contenido para reproducir
    }
    // Crea un AudioContext si no existe uno
    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    // Crear un nuevo objeto de Audio y reproducirlo
    const newAudio = new Audio(audioUrl);
    if (enableAnimation) {
      console.log("Entro al if");
      // Establecer el estado a 'true' cuando comience la reproducción
      newAudio.onplay = () => setIsPlaying(true);

      // Establecer el estado a 'false' cuando termine la reproducción
      newAudio.onended = () => setIsPlaying(false);
    }
    newAudio.play();
  } catch (error) {
    console.error("Error converting text to speech:", error);
  }
};

export { ChangeData, convertToSpeech };
