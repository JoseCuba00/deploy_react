import { motion, AnimatePresence } from "framer-motion";

const TaskNavbar = ({ currentQuestion, setCurrentQuestion, questionData }) => {
  //#8f8f8f
  const GetBorder = (num, obj) => {
    const isCurrentQuestion = currentQuestion === num - 1;
    const background = obj.completed ? "#5dbc4a" : "rgb(190,200,200)";
    const color = isCurrentQuestion
      ? "white"
      : obj.completed
      ? "white"
      : "white";
    const border = isCurrentQuestion ? "2px solid #373A40" : "";
    return {
      background,
      color,
      border,
    };
  };
  const handleClick = (event) => {
    setCurrentQuestion(Number(event.target.id) - 1);
  };

  return (
    <div
      className="pt-1"
      style={{ position: "fixed", width: "100%", top: "60px", zIndex: 1000 }}
    >
      <AnimatePresence mode="wait">
        {
          <motion.div
            initial={{
              y: "-80%",
              opacity: 0,
            }}
            animate={{
              y: "0%",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.5,
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <nav
              className="navbar navbar-expand-lg navbar-light"
              style={{
                backgroundColor: "rgb(245,245,245)",
                width: "100%", // Asegúrate de que ocupe todo el ancho
              }}
            >
              <div
                key="navbar"
                className="container collapse navbar-collapse justify-content-end"
                id="navbarSupportedContent"
              >
                <div className="d-flex squareFather">
                  {questionData.map((obj, index) => (
                    <div
                      onClick={handleClick}
                      id={index + 1}
                      style={GetBorder(index + 1, obj)}
                      className="squareChild"
                      key={index}
                    >
                      {currentQuestion === index
                        ? index + 1
                        : obj.completed
                        ? "✓"
                        : index + 1}
                    </div>
                  ))}
                </div>
                <form className="form-inline my-2 my-lg-0"></form>
              </div>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
};

export default TaskNavbar;
