import React, { useCallback } from "react";
import { sampleText } from "/assets/sample text.js";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Reader.module.css";
import { Button, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function Reader() {
  const [text] = useState(sampleText.split(" "));
  const [display, setDisplay] = useState({ text: text[0], index: 0 });
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(200);
  const [showMainControls, setShowMainControls] = useState(true);
  const [showWpmControls, setShowWpmControls] = useState(false);
  const [freeScroll, setFreeScroll] = useState(true);
  const wpmList = useMemo(() => {
    return new Array(1000 / 50).fill(50).map((item, i) => item * (i + 1));
  }, []);
  let textTick = useRef();
  const textContainer = useRef();
  const activeWord = useRef();
  const selectedWpm = useRef();
  const beforeText = useMemo(() => {
    const textCopy = [...text];
    return textCopy.slice(0, display.index).join(" ");
  }, [text, display.index]);
  const afterText = useMemo(() => {
    const textCopy = [...text];
    return textCopy.slice(display.index + 1, textCopy.length).join(" ");
  }, [text, display.index]);

  const wpmSpeed = useMemo(() => (60 / wpm) * 1000, [wpm]);

  const start = useCallback(() => {
    setStarted(true);
    textTick.current = setInterval(() => {
      setDisplay((d) => {
        return {
          text: text[d.index + 1],
          index: d.index + 1,
        };
      });
    }, wpmSpeed);
  }, [text, wpmSpeed]);

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

  const handleWpmControlsOpen = () => {
    setShowMainControls(false);
    setShowWpmControls(true);
  };
  const handleWpmControlsClose = () => {
    setShowMainControls(true);
    setShowWpmControls(false);
  };

  const selectWpm = (newWpm) => {
    setWpm(newWpm);
    handleWpmControlsClose();
  };

  function throttle(callbackFn, limit) {
    let wait = false;
    return function () {
      if (!wait) {
        callbackFn.call();
        wait = true;
        setTimeout(function () {
          wait = false;
        }, limit);
      }
    };
  }

  const getPrevWord = useCallback(() => {
    setDisplay((d) => {
      return {
        text: d.index > 0 && text[d.index - 1],
        index: d.index > 0 && d.index - 1,
      };
    });
  }, [text]);

  const getNextWord = useCallback(() => {
    setDisplay((d) => {
      return {
        text: d.index < text.length && text[d.index + 1],
        index: d.index < text.length && d.index + 1,
      };
    });
  }, [text]);

  const readOnScroll = useCallback(
    (e) => {
      if (e.wheelDeltaY < 0) {
        getNextWord();
        return;
      }

      getPrevWord();
    },
    [getNextWord, getPrevWord]
  );

  const scrollIntoView = useCallback((e) => {
    activeWord.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center",
    });
  }, []);

  const toggleScrollLock = () => {
    if (!freeScroll) {
      setFreeScroll(true);
      activeWord.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
      textContainer.current.addEventListener("wheel", readOnScroll);
      textContainer.current.addEventListener("scroll", scrollIntoView);
    }
    if (freeScroll) {
      setFreeScroll(false);
      textContainer.current.removeEventListener("wheel", readOnScroll);
      textContainer.current.removeEventListener("scroll", scrollIntoView);
    }
  };

  useEffect(() => {
    textContainer.current.addEventListener("wheel", readOnScroll);
    textContainer.current.addEventListener("scroll", scrollIntoView);
  }, [readOnScroll, scrollIntoView]);

  // Adding listener to Space key to stars/stop reading
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

  // Scrolls to current active word after stop func
  useEffect(() => {
    !started &&
      activeWord.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
  }, [started]);

  // Scrolls to current selected wpm speed
  useEffect(() => {
    showWpmControls && selectedWpm.current?.scrollIntoView(false);
  }, [showWpmControls]);

  // Stopping reading if last word is read
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
      <Box
        sx={{
          display: "flex",
          position: "sticky",
          bottom: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "bisque",
          borderRadius: "10px",
          height: "100px",
          m: 0,
          p: 2,
        }}
      >
        {showWpmControls && (
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                overflowX: "scroll",
                height: "100%",
                whiteSpace: "nowrap",
                m: 0,
                // p: "5px",
              }}
            >
              {wpmList.map((item) => (
                <Button
                  key={item}
                  onClick={() => selectWpm(item)}
                  sx={{
                    border: item === wpm ? 1 : 0,
                  }}
                  ref={item === wpm ? selectedWpm : null}
                >
                  {item}
                </Button>
              ))}
            </Box>
            <IconButton
              size="small"
              sx={{ p: 1, mb: 2 }}
              onClick={handleWpmControlsClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {showMainControls && (
          <Box>
            <Button onClick={toggleScrollLock}>Free</Button>
            <Button onClick={handleWpmControlsOpen}>{wpm}WPM</Button>
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
        )}
      </Box>
    </Box>
  );
}
