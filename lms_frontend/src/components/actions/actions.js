import axios from 'axios';

const putRequestComplete = async (path, value) => {
    let response = await fetch(`http://127.0.0.1:8000/${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: value })
    });
    if (response.ok) {
        let json = await response.json();


    } else {
        alert("Ошибка HTTP: " + response.status);
    }

}
const ChangeData = async (setQuestionData, setTopicData, questionId, assignments_id) => {

    setQuestionData(prevQuestionData =>
        prevQuestionData.map(question =>
            question.id === questionId ? { ...question, completed: true } : question
        )
    );
    putRequestComplete(`questions_update/${questionId}`, true)
    
    setTopicData(Topic => {
        let array = Topic.map(topic => {
            return {
                ...topic,
                assignments: topic.assignments.map(assignment => {
                    if (assignment.id === Number(assignments_id)) {
                        putRequestComplete(`assignments/${assignments_id}`, assignment.completed + 1)
                        return { ...assignment, completed: assignment.completed + 1 };
                    } else {
                        return assignment;
                    }
                })
            }
        }
        );

        return array
    }

    );
    
}

const convertToSpeech = async (text) => {
    console.log('entro aqui')
    try {
        const response = await axios.post('http://127.0.0.1:8000/convert/', { text }, {
            responseType: 'arraybuffer'
        });
        // Crea un AudioContext si no existe uno
        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        // Crear un nuevo objeto de Audio y reproducirlo
        const newAudio = new Audio(audioUrl);
        newAudio.play();
    } catch (error) {
        console.error('Error converting text to speech:', error);
    }
};


// actualizar la pregunta para que se pinte de verde 

export { ChangeData,convertToSpeech }