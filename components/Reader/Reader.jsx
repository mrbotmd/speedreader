import { sampleText } from "/assets/sample text.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import { ReaderControls } from "./components/ReaderControls/ReaderControls";
import { MainText } from "./components/MainText";
import { ReadingArea } from "./components/ReadingArea";

export function Reader() {
  const [text] = useState(sampleText.split(" "));
  const [display, setDisplay] = useState({ text: text[0], index: 0 });
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(200);
  const textContainer = useRef();
  const activeWord = useRef();

  const beforeText = useMemo(() => {
    const textCopy = [...text];
    return textCopy.slice(0, display.index).join(" ");
  }, [text, display.index]);
  const afterText = useMemo(() => {
    const textCopy = [...text];
    return textCopy.slice(display.index + 1, textCopy.length).join(" ");
  }, [text, display.index]);

  // Scrolls to current active word after stop func
  useEffect(() => {
    !started &&
      activeWord.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
  }, [started]);

  // Stopping reading if last word is read
  useEffect(() => {
    if (display.index === text.length) {
      clearInterval(textTick.current);
    }
  }, [display.index, text, started]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {started && <ReadingArea activeWord={display.text} />}
      {!started && (
        <MainText
          textContainer={textContainer}
          activeWord={display.text}
          beforeText={beforeText}
          afterText={afterText}
          activeWordRef={activeWord}
        />
      )}
      <ReaderControls
        wpm={[wpm, setWpm]}
        started={[started, setStarted]}
        display={[display, setDisplay]}
        text={text}
        activeWord={activeWord}
        parentContainer={textContainer}
      />
    </Box>
  );
}
