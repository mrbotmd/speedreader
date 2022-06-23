import React from "react";
import { sampleText } from "/assets/sample text.js";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Reader.module.css";

export function Reader() {
  const [text, setText] = useState([]);
  const [display, setDisplay] = useState({ text: "", index: 0 });
  const [started, setStarted] = useState(false);
  let textTick = useRef();
  const activeWord = useRef();
  let whiteSpaceTick = useRef();
  const beforeText = useMemo(
    () => text.slice(0, display.index).join(" "),
    [text, display.index]
  );
  const afterText = useMemo(
    () => text.slice(display.index + 1, text.length).join(" "),
    [text, display.index]
  );
  const start = () => {
    setStarted(true);
    textTick.current = setInterval(() => {
      setDisplay((d) => {
        return {
          text: text[d.index],
          index: d.index++,
        };
      });
    }, 10);
  };
  const stop = () => {
    setStarted(false);
    clearInterval(textTick.current);
    clearInterval(whiteSpaceTick.current);
  };

  const restart = () => {
    setDisplay({
      text: text[0],
      index: 0,
    });
    start();
  };

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
    <div className={styles.textContainer}>
      <div>{beforeText}</div>
      <div className={styles.textFocus} ref={activeWord}>
        {display.text}
      </div>
      <div>{afterText}</div>
      <div className={styles.toWhiteGradient}></div>

      <div className={styles.buttons}>
        {display.index !== text.length && !started && (
          <button className={styles.button} onClick={start}>
            start
          </button>
        )}
        {display.index === text.length && (
          <button className={styles.button} onClick={restart}>
            restart
          </button>
        )}
        {started && (
          <button className={styles.button} onClick={stop}>
            stop
          </button>
        )}
      </div>
    </div>
  );
}
