import { useState, useEffect, useCallback } from "react";
import { QuizBottons } from "../quizBottons";
import { ChangeData } from "../actions/actions";
import ReactPlayer from "react-player";

function TheoryComoponent({
  title,
  content,
  isCompleted,
  setCurrentQuestion,
  currentQuestion,
  totalQuestions,
  setQuestionData,
  setTopicData,
  questionId,
  assignments_id,
  userId,
}) {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  });

  const MyComponent = ({ htmlString }) => {
    // Use a regular expression to find the oembed element in the HTML string
    const oembedRegex = /<oembed[^>]*>/g;
    const oembedMatch = htmlString.match(oembedRegex);

    // If an oembed element was found, convert it to an iframe element
    if (oembedMatch) {
      const oembedUrl = oembedMatch[0].match(/url="([^"]*)"/)[1];
      const iframeElement = `<iframe src="${oembedUrl}" frameborder="0" width = "700px" height = "300px" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      htmlString = htmlString.replace(oembedRegex, iframeElement);
    }

    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  const onClickSubmit = () => {
    !isCompleted &&
      ChangeData(
        setQuestionData,
        setTopicData,
        questionId,
        assignments_id,
        userId,
        "theory_update"
      );
    setShowResult(true);
  };
  const onClickNext = useCallback(() => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  }, [setCurrentQuestion]);
  console.log(content);
  // Se le pone la clase ck-content para que no afecte al resto de las paginas
  return (
    <div
      className=" ck-content"
      style={{ flex: "1", position: "relative", top: "120px" }}
    >
      <MyComponent htmlString={content} />
      <div className="ps-5 pe-5">
        <QuizBottons
          buttonName={"Mark as read"}
          completed={showResult ? true : null}
          onClickButton={onClickSubmit}
          onClickNext={onClickNext}
          Next={currentQuestion === totalQuestions}
        />
      </div>
    </div>
  );
}

export default TheoryComoponent;
