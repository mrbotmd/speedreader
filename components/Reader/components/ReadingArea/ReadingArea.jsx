import { Box, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";

export function ReadingArea({ activeWord, sx }) {
  const wordRef = useRef();
  const markedLetterRef = useRef();

  const markedWord = useMemo(() => {
    if (wordRef.current) {
      wordRef.current.style.visibility = "hidden";
    }
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
          position: "absolute",
          top: "50%",
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
      const leftPosition = Math.round(docXMiddle - beforeMarkedDistance);

      wordRef.current.style.left = `${leftPosition}px`;
      wordRef.current.style.visibility = "visible";
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
