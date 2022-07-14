import { Box, Typography } from "@mui/material";
import React, { useMemo, useRef } from "react";

export function ReadingArea({ activeWord, sx }) {
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
        ref={markedWordRef}
        sx={{
          fontSize: "2rem",
          display: "flex",
        }}
      >
        {before}
        <Box
          ref={markedLetterRef}
          component="span"
          sx={{
            color: "error.light",
            display: "inline-block",
            position: "relative",
          }}
        >
          {middleLetter}
        </Box>
        {after}
      </Typography>
    );
  }, [activeWord]);
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
