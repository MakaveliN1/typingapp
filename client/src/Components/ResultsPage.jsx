import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ResultsPage(props) {
  const navigate = useNavigate();
  const previousIsPlaying = useRef();

  useEffect(() => {
    if (
      props.isPlaying === false &&
      props.isPlaying !== previousIsPlaying.current &&
      localStorage.getItem("isLoggedIn") === "true"
    ) {
      axios
        .post("http://localhost:5000/save-stats", {
          dateAdded: new Date(),
          username: localStorage.getItem("currentUser"),
          accuracy: parseFloat(props.accuracy),
          wpm: parseInt(props.wpm),
          awpm: parseInt(props.awpm),
          gwpm: parseInt(props.gwpm),
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      return;
    }
    previousIsPlaying.current = props.isPlaying;
  }, [props.isPlaying]);

  const showStats_ = () => {
    navigate("/DisplayStats");
  };
  const showLeaderBoard = () => {
    navigate("/LeaderBoard");
  };
  return (
    <div>
      <div className="result">
        <h1>Result:</h1>
        <p>Your Accuracy was: {props.accuracy.toFixed(2)}%</p>
        <p>Your Words Per Minute was: {props.wpm.toFixed(0)}</p>
        <p>Your Adjusted Words Per Minute(AWPM) was: {props.awpm.toFixed(0)}</p>
        <p>Your Gross Words Per Minute(GWPM) was: {props.gwpm.toFixed(0)}</p>
        <button className="dynamic-button" onClick={showStats_}>
          Previous Stats
        </button>
        <button className="dynamic-button" onClick={props.onTryAgain}>
          Try Again
        </button>
        <button className="dynamic-button" onClick={showLeaderBoard}>
          LeaderBoard
        </button>
      </div>
    </div>
  );
}
export default ResultsPage;
