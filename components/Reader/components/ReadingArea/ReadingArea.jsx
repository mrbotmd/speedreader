import { Box, Typography } from "@mui/material";
import React from "react";

export function ReadingArea({ activeWord, sx }) {
  const markedWord = () => {
    let letterCount = activeWord.length;
    let letterPosition =
      (letterCount / 2) % 2 === 0
        ? letterCount / 2 - 1
        : Math.ceil(letterCount / 2) - 1;
    let middleLetter = activeWord[letterPosition];
    let before = activeWord.slice(0, letterPosition);
    let after = activeWord.slice(letterPosition + 1, activeWord.length);
    let markedLetter = <span style={{ color: "red" }}>{middleLetter}</span>;

    return (
      <Typography>
        {before}
        {markedLetter}
        {after}
      </Typography>
    );
  };
  return (
    <Box
      sx={{
        fontSize: "2rem",
        margin: "0 auto",
        padding: "10px",
        ...sx,
      }}
    >
      {markedWord()}
    </Box>
  );
}
