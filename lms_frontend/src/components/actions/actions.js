import axios from "axios";

const putRequestComplete = async (path, value) => {
  let response = await fetch(
    `https://web-production-0a07.up.railway.app/${path}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: value }),
      credentials: "include",
    }
  );
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
  type, // sirve para indicar el tipo , si es un contenido teorico o una pregunta y asi diferenciamos los id
  destiny
) => {
  setQuestionData(
    (
      prevQuestionData // Para que se cambie de color instantaneamente
    ) =>
      prevQuestionData.map((question) =>
        question.id === questionId && question.hasOwnProperty(type)
          ? { ...question, completed: true }
          : question
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

const convertToSpeech = async (text) => {
  console.log("Me activo");
  try {
    const response = await axios.post(
      "https://web-production-0a07.up.railway.app/convert/",
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

    return newAudio;
  } catch (error) {
    console.error("Error converting text to speech:", error);
  }
};

export { ChangeData, convertToSpeech };
