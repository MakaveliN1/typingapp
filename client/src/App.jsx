import React, { useState, useEffect } from "react";
import randomWords from "random-words";
import ResultsPage from "./Components/ResultsPage";
import "./App.css";
function TypingApp() {
  const [currentParagraph, setCurrentParagraph] = useState("");
  const [typedText, setTypedText] = useState("Type here~");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerLength, setTimerLength] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(timerLength);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [awpm, setAwpm] = useState(0);
  const [gwpm, setGwpm] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [numberOfWords, setNumberOfWords] = useState(84);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [finalWpm, setFinalWpm] = useState(0);
  const [finalGpm, setFinalGpm] = useState(0);
  const [finalAwpm, setFinalAwpm] = useState(0);
  const [lastParagraph, setLastParagraph] = useState("");
  const [lastTypedText, setLastTypedText] = useState("");

  const calculateStats = () => {
    const currentWords = currentParagraph.split(" ");

    const typedWords = typedText.split(" ");
    const correctWords = typedWords.reduce((total, word, index) => {
      if (word === currentWords[index]) {
        return total + 1;
      }
      return total;
    }, 0);
    setAccuracy((correctWords / typedWords.length) * 100);

    const elapsedTime = timerLength - timeRemaining;

    let correctTotalChars = 0;
    let allTypedChars = typedText.length;
    typedWords.forEach((word, index) => {
      if (word === currentWords[index]) {
        correctTotalChars += word.length + 1;
      }
    });

    setWpm((correctTotalChars / 5 / elapsedTime) * 60);
    setGwpm((allTypedChars / 5 / elapsedTime) * 60);
    setAwpm(wpm * (accuracy / 100));
  };

  useEffect(() => {
    calculateStats();
  }, [currentParagraph, typedText, timerLength, timeRemaining]);

  useEffect(() => {
    if (timeRemaining > 0 && isPlaying) {
      const timerId = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeRemaining, isPlaying]);

  const generateParagraph = () => {
    const paragraph = [];
    const randomParagraphCount = Math.floor(Math.random() * 20) + 8;
    while (paragraph.length < randomParagraphCount) {
      const line = [];

      while (line.length < numberOfWords / randomParagraphCount) {
        line.push(randomWords());
      }
      paragraph.push(line.join(" "));
    }
    const capitalizedParagraph = paragraph.map((line) => {
      return line[0].toUpperCase() + line.slice(1);
    });
    setCurrentParagraph(capitalizedParagraph.join(". ") + ".");
  };

  useEffect(() => {
    generateParagraph();
  }, [numberOfWords]);

  useEffect(() => {
    if (timeRemaining === 0 || typedText === currentParagraph) {
      setShowResults(true);
      setFinalAccuracy(accuracy);
      setFinalWpm(wpm);
      setFinalAwpm(awpm);
      setFinalGpm(gwpm);
      generateParagraph();
      setLastParagraph(currentParagraph);
      setLastTypedText(typedText);
      setTypedText("");
      setTimeRemaining(timerLength);
      setIsPlaying(false);
    }
  }, [timeRemaining, currentParagraph, typedText, timerLength]);

  const inputRef = React.createRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  function handleChange(event) {
    setTypedText(event.target.value);
  }

  function handleStartClick() {
    setTimeRemaining(timerLength);
    setIsPlaying(true);
    setTypedText("");
  }

  return (
    <div>
      {showResults ? (
        <ResultsPage
          paragraph={lastParagraph}
          typedText={lastTypedText}
          accuracy={finalAccuracy}
          wpm={finalWpm}
          awpm={finalAwpm}
          gwpm={finalGpm}
          isPlaying={isPlaying}
          onTryAgain={() => {
            setShowResults(false);
            setTypedText("Type here~");
          }}
        />
      ) : (
        <div>
          <div className="generated-text">
            <h2>Type the paragraph:</h2>

            <h3>{currentParagraph}</h3>
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleChange}
              disabled={!isPlaying}
              rows={6}
              style={{
                width: "100%",
                backgroundColor: "#323437",
                color: "#d1d0c5",
              }}
            />
          </div>
          {isPlaying ? (
            <div className="result">
              <br />
              <p>Time remaining: {timeRemaining}</p>
              <p>Accuracy: {accuracy.toFixed(2)}%</p>
              <p>WPM: {wpm.toFixed(0)}</p>
              <p>Adjusted WPM: {awpm.toFixed(0)}</p>
              <p>Gross WPM: {gwpm.toFixed(0)}</p>
            </div>
          ) : (
            <div>
              <div className="generated-text">
                <br></br>
                <label htmlFor="timer-length">Timer length:</label>
                <input
                  id="timer-length"
                  type="number"
                  value={timerLength}
                  min={1}
                  style={{
                    backgroundColor: "#323437",
                    color: "#d1d0c5",
                    margin: "10px",
                  }}
                  onChange={(event) =>
                    setTimerLength(Number(event.target.value))
                  }
                />
                <button onClick={handleStartClick} className="dynamic-button">
                  Start
                </button>
              </div>
              <br></br>
              <div className="generated-text">
                <label htmlFor="words-length">Number of Words:</label>
                <input
                  id="words-length"
                  type="range"
                  value={numberOfWords}
                  min={50}
                  max={200}
                  style={{
                    backgroundColor: "#323437",
                    color: "#d1d0c5",
                    margin: "10px",
                  }}
                  onChange={(event) =>
                    setNumberOfWords(Number(event.target.value))
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TypingApp;
