import React, { createContext, useCallback } from "react";
import { sampleText } from "/assets/sample text.js";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Reader.module.css";
import { Button, Box, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SpeedIcon from "@mui/icons-material/Speed";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { ReaderControls } from "./components/ReaderControls/ReaderControls";

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
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box className={styles.textContainer} ref={textContainer}>
        <Box>{beforeText}</Box>
        <Box className={styles.textFocus} ref={activeWord}>
          {display.text}
        </Box>
        <Box>{afterText}</Box>
        <Box className={styles.toWhiteGradient}></Box>
      </Box>
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
