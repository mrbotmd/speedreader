import { Box, Typography } from "@mui/material";
import React, { useMemo, useRef } from "react";

export function ReadingArea({ activeWord, sx }) {
  const wordRef = useRef();
  const markedLetterRef = useRef();

  function getBoundingClientRect(element) {
    if (!element) return;
    var rect = element?.getBoundingClientRect();
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    };
  }

  const markedWord = useMemo(() => {
    let letterCount = activeWord.length;
    let letterPosition =
      (letterCount / 2) % 2 === 0
        ? letterCount / 2 - 1
        : Math.ceil(letterCount / 2) - 1;
    let middleLetter = activeWord[letterPosition];
    let before = activeWord.slice(0, letterPosition);
    let after = activeWord.slice(letterPosition + 1, activeWord.length);
    return (
      <Typography
        ref={wordRef}
        sx={{
          fontSize: "2rem",
          width: "max-content",
          position: "absolute",
          top: "50%",
          left: `${markedOffset}px`,
        }}
      >
        {before}
        <Typography
          ref={markedLetterRef}
          component="span"
          sx={{
            fontSize: "2rem",
            color: "error.light",
            display: "inline-block",
          }}
        >
          {middleLetter}
        </Typography>
        {after}
      </Typography>
    );
  }, [activeWord]);
  return (
    <Box
      sx={{
        ...sx,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {markedWord}
    </Box>
  );
}
