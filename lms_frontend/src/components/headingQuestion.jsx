const HeadingQuestions = (props) => {
  return (
    <div
      className="d-flex pb-4 ps-4 pe-auto div_img_speaker"
      onClick={() =>
        props.convertToSpeech(props.sentence, props.animate, props.setIsPlaying)
      }
      role="button"
    >
      <div className={`loader ${props.isPlaying ? "playing" : ""}`}>
        <span className="stroke" style={{ height: "10px" }}></span>
        <span className="stroke" style={{ height: "20px" }}></span>
        <span className="stroke" style={{ height: "35px" }}></span>
        <span className="stroke" style={{ height: "20px" }}></span>
        <span className="stroke" style={{ height: "30px" }}></span>
        <span className="stroke" style={{ height: "20px" }}></span>
        <span className="stroke" style={{ height: "10px" }}></span>
      </div>

      <div className="ps-2">{props.sentence}</div>
    </div>
  );
};
export default HeadingQuestions;
