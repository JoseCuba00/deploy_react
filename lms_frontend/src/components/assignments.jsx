import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import Module from "./module";
import CheckBoxQuiz from "./quiz/checkBoxQuiz";
import DragDropQuiz from "./quiz/DrapDropQuiz";
import DropDownQuiz from "./quiz/dropDownQuiz";
import SelectQuiz from "./quiz/selectQuiz";
import RadioQuiz from "./quiz/quiz";
import ClickToRowQuiz from "./quiz/clickToRowQuiz";
import TaskNavbar from "./TaskNavbar";
import AuthContext from "../context/AuthContext";
import LoadingIndicator from "./LoadingIndicator";
import TheoryComponent from "./theory/theoryComponent";

const quizComponents = {
  1: RadioQuiz,
  2: CheckBoxQuiz,
  3: DropDownQuiz,
  4: SelectQuiz,
  5: DragDropQuiz,
  6: ClickToRowQuiz,
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function Quiz() {
  const { module_id, assignments_id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionData, setQuestionData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setCurrentQuestion(0); // Reset current question to 0

    try {
      const [assignmentsRes, moduleRes] = await Promise.all([
        fetch(
          `http://127.0.0.1:8000/module/${module_id}/assignments/${assignments_id}?student_id=${user.id}`,
          { credentials: "include" }
        ),
        fetch(
          `http://127.0.0.1:8000/module/${module_id}?student_id=${user.id}`,
          { credentials: "include" }
        ),
      ]);

      if (!assignmentsRes.ok || !moduleRes.ok) {
        throw new Error(
          `HTTP error! status: ${assignmentsRes.status} ${moduleRes.status}`
        );
      }

      const [assignmentsData, moduleData] = await Promise.all([
        assignmentsRes.json(),
        moduleRes.json(),
      ]);

      setQuestionData(assignmentsData.data);
      setTopicData(moduleData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Ошибка HTTP: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [assignments_id, module_id, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
    const currentQuestionData = questionData[currentQuestion];

    if (!currentQuestionData) {
      return <div>Error fetching data</div>;
    }

    if (currentQuestionData.theory) {
      const { completed, theory, id } = currentQuestionData;
      const { title, content } = theory;

      return (
        <TheoryComponent
          title={title}
          content={content}
          isCompleted={completed}
          setCurrentQuestion={setCurrentQuestion}
          currentQuestion={currentQuestion}
          totalQuestions={questionData.length - 1}
          setQuestionData={setQuestionData}
          setTopicData={setTopicData}
          questionId={id}
          assignments_id={assignments_id}
          userId={user.id}
        />
      );
    } else {
      const { completed, question, id } = currentQuestionData;
      const { choices, sentences, title, type, isText, answer } = question;
      const SelectedQuizComponent = quizComponents[type];

      return (
        <SelectedQuizComponent
          sentencesList={sentences}
          choices={choices}
          answers={answer}
          setCurrentQuestion={setCurrentQuestion}
          currentQuestion={currentQuestion}
          totalQuestions={questionData.length - 1}
          shuffleArray={shuffleArray}
          questionId={id}
          setQuestionData={setQuestionData}
          isCompleted={completed}
          setTopicData={setTopicData}
          assignments_id={assignments_id}
          isText={isText}
          userId={user.id}
        />
      );
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <>
      <TaskNavbar
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        questionData={questionData}
      />
      <div style={{ display: "flex" }}>
        <Module TopicData={topicData} />
        <div
          style={{
            paddingLeft: "18%",
            zIndex: 1,
          }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default Quiz;
