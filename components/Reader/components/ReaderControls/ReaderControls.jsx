import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SpeedIcon from "@mui/icons-material/Speed";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";

export function ReaderControls({
  wpm: wpmProp,
  started: startedProp,
  display: displayProp,
  text,
  activeWord,
  parentContainer,
  ...rest
}) {
  const [wpm, setWpm] = wpmProp;
  const [started, setStarted] = startedProp;
  const [display, setDisplay] = displayProp;

  const [scrollLock, setScrollLock] = useState(false);
  const [showMainControls, setShowMainControls] = useState(true);
  const [showWpmControls, setShowWpmControls] = useState(false);

  const selectedWpm = useRef();
  const textTickSpeed = useRef();

  const wpmSpeed = useMemo(() => (60 / wpm) * 1000, [wpm]);
  const wpmList = useMemo(() => {
    return new Array(1000 / 50).fill(50).map((item, i) => item * (i + 1));
  }, []);

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

  const start = useCallback(() => {
    setStarted(true);
    textTickSpeed.current = setInterval(() => {
      setDisplay((d) => {
        return {
          text: text[d.index + 1],
          index: d.index + 1,
        };
      });
    }, wpmSpeed);
  }, [text, wpmSpeed, setStarted, setDisplay]);

  const stop = useCallback(() => {
    setStarted(false);
    clearInterval(textTickSpeed.current);
  }, [setStarted]);

  const toggleRead = useCallback(() => {
    !started && start();
    started && stop();
  }, [started, start, stop]);

  const restart = useCallback(() => {
    setDisplay(() => {
      return {
        text: text[0],
        index: 0,
      };
    });
  }, [text, setDisplay]);

  const getPrevWord = useCallback(() => {
    setDisplay((d) => {
      return {
        text: d.index > 0 ? text[d.index - 1] : text[d.index],
        index: d.index > 0 ? d.index - 1 : d.index,
      };
    });
  }, [text, setDisplay]);

  const getNextWord = useCallback(() => {
    setDisplay((d) => {
      return {
        text: d.index < text.length ? text[d.index + 1] : text[d.index],
        index: d.index < text.length ? d.index + 1 : d.index,
      };
    });
  }, [text, setDisplay]);

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

  const scrollActiveWordIntoView = useCallback(
    (e) => {
      activeWord.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    },
    [activeWord]
  );

  const toggleScrollLock = useCallback(() => {
    if (!scrollLock) {
      setScrollLock(true);
      activeWord.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
      parentContainer.current.addEventListener("wheel", readOnScroll);
      parentContainer.current.addEventListener(
        "scroll",
        scrollActiveWordIntoView
      );
    }
    if (scrollLock) {
      setScrollLock(false);
      parentContainer.current.removeEventListener("wheel", readOnScroll);
      parentContainer.current.removeEventListener(
        "scroll",
        scrollActiveWordIntoView
      );
    }
  }, [
    parentContainer,
    readOnScroll,
    scrollActiveWordIntoView,
    scrollLock,
    activeWord,
  ]);

  // Scrolls to current selected wpm speed
  useEffect(() => {
    showWpmControls && selectedWpm.current?.scrollIntoView(false);
  }, [showWpmControls]);

  // Adding listener to Space key to stars/stop reading
  useEffect(() => {
    const inEffectToggleRead = (e) => {
      e.code === "Space" && e.preventDefault();
      e.code === "Space" && toggleRead();
    };
    window.addEventListener("keydown", inEffectToggleRead);

    return () => {
      window.removeEventListener("keydown", inEffectToggleRead);
    };
  }, [toggleRead, parentContainer]);

  // Stopping reading if last word is read
  useEffect(() => {
    if (display.index === text.length) {
      clearInterval(textTickSpeed.current);
      setStarted(false);
    }
  }, [display.index, text, started, setStarted]);

  useEffect(() => {
    const cleanupVar = parentContainer.current;
    return () => {
      cleanupVar.removeEventListener("wheel", readOnScroll);
      cleanupVar.removeEventListener("scroll", scrollActiveWordIntoView);
    };
  }, [parentContainer, readOnScroll, scrollActiveWordIntoView]);

  return (
    <Paper
      sx={{
        gridArea: "controls",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "1fr",
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        flexWrap: "nowrap",
        alignItems: "center",
        p: 2,
        mb: "20px",
      }}
    >
      {showWpmControls && (
        <Box
          sx={{
            gridColumnStart: "1",
            gridColumnEnd: "4",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
        >
          <Box
            sx={{
              gridColumnStart: "1",
              gridColumnEnd: "6",
              overflowX: "scroll",
              height: "50px",
              m: 0,
              whiteSpace: "nowrap",
              alignSelf: "center",
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
            sx={{
              p: 1,
              mb: 2,
              gridColumnStart: "6",
              gridColumnEnd: "7",
              justifySelf: "center",
              alignSelf: "center",
            }}
            onClick={handleWpmControlsClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      {showMainControls && (
        <>
          <Box
            sx={{
              gridColumnStart: "1",
              gridColumnEnd: "2",
              justifySelf: "center",
              alignSelf: "center",
            }}
          >
            <Button onClick={handleWpmControlsOpen}>{wpm}WPM</Button>
          </Box>
          <Box
            sx={{
              gridColumnStart: "2",
              gridColumnEnd: "3",
              justifySelf: "center",
              alignSelf: "center",
            }}
          >
            <IconButton
              onClick={getPrevWord}
              sx={{
                color: "text.primary",
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
              variant="standard"
              size="large"
              onClick={display.index === text.length ? restart : toggleRead}
              sx={{
                color: "primary.contrastText",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              {!started && display.index !== text.length && <PlayArrowIcon />}
              {started && display.index !== text.length && <StopIcon />}
              {!started && display.index === text.length && <ReplayIcon />}
            </IconButton>

            <IconButton
              onClick={getNextWord}
              sx={{
                color: "text.primary",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              justifySelf: "center",
              alignSelf: "center",
              gridColumnStart: "3",
              gridColumnEnd: "4",
            }}
          >
            <IconButton color="primary" onClick={toggleScrollLock}>
              {scrollLock ? <SpeedIcon /> : <MenuBookIcon />}
            </IconButton>
          </Box>
        </>
      )}
    </Paper>
  );
}
