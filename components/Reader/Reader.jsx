import React, { useCallback } from "react";
import { sampleText } from "/assets/sample text.js";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Reader.module.css";
import { Button, Box } from "@mui/material";

export function Reader() {
  const [text, setText] = useState([]);
  const [display, setDisplay] = useState({ text: "", index: 0 });
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(200);
  let textTick = useRef();
  const textContainer = useRef();
  const activeWord = useRef();
  const beforeText = useMemo(
    () => text.slice(0, display.index).join(" "),
    [text, display.index]
  );
  const afterText = useMemo(
    () => text.slice(display.index + 1, text.length).join(" "),
    [text, display.index]
  );

  const speed = useMemo(() => (60 / wpm) * 1000, [wpm]);

  const start = useCallback(() => {
    setStarted(true);
    textTick.current = setInterval(() => {
      setDisplay((d) => {
        return {
          text: text[d.index],
          index: d.index++,
        };
      });
    }, speed);
  }, [text, speed]);

  const stop = () => {
    setStarted(false);
    clearInterval(textTick.current);
  };

  const restart = () => {
    setDisplay({
      text: text[0],
      index: 0,
    });
    start();
  };

  const toggleRead = useCallback(() => {
    !started && start();
    started && stop();
  }, [started, start]);

  useEffect(() => {
    const inEffectToggleRead = (e) => {
      e.code === "Space" && e.preventDefault();
      e.code === "Space" && toggleRead();
    };
    document.addEventListener("keydown", inEffectToggleRead);

    return () => {
      document.removeEventListener("keydown", inEffectToggleRead);
    };
  }, [toggleRead]);

  useEffect(() => {
    setText(sampleText.split(" "));
    !started &&
      activeWord.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
  }, [started]);

  useEffect(() => {
    if (display.index === text.length) {
      clearInterval(textTick.current);
    }
  }, [display.index, text, started]);

  return (
    <Box className={styles.textContainer} ref={textContainer}>
      <Box>{beforeText}</Box>
      <Box className={styles.textFocus} ref={activeWord}>
        {display.text}
      </Box>
      <Box>{afterText}</Box>
      <Box className={styles.toWhiteGradient}></Box>
      <Box className={styles.controls}>
        <Box className={styles.buttons}>
          <Button>{wpm}WPM</Button>
          {display.index !== text.length && (
            <Button
              variant="contained"
              className={styles.button}
              onClick={toggleRead}
            >
              {!started ? "start" : "stop"}
            </Button>
          )}
          {display.index === text.length && (
            <Button className={styles.button} onClick={restart}>
              restart
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
