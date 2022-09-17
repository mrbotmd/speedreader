import { Box, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";

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

  useEffect(() => {
    if (wordRef.current) {
      const beforeMarkedDistance =
        markedLetterRef.current.getBoundingClientRect().left +
        markedLetterRef.current.getBoundingClientRect().width / 2 -
        wordRef.current.getBoundingClientRect().left;
      const docXMiddle = document.body.clientWidth / 2;
      wordRef.current.style.position = "absolute";
      wordRef.current.style.top = "50%";
      wordRef.current.style.left = `${docXMiddle - beforeMarkedDistance}px`;
    }
  });

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      {markedWord}
    </Box>
  );
}
