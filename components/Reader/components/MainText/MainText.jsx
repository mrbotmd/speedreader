import { Box } from "@mui/material";
import React from "react";

export function MainText({
  textContainer,
  activeWord,
  beforeText,
  afterText,
  activeWordRef,
}) {
  return (
    <Box
      ref={textContainer}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "scroll",
        position: "relative",
        padding: "0 35%",
      }}
    >
      <Box>{beforeText}</Box>
      <Box
        ref={activeWordRef}
        sx={{
          fontSize: "2rem",
          margin: "0 auto",
          padding: "10px",
        }}
      >
        {activeWord}
      </Box>
      <Box>{afterText}</Box>
      <Box
        sx={{
          position: "sticky",
          bottom: "0",
          width: "100%",
          pt: "200px",
          pointerEvents: "none",
          background:
            "linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
        }}
      ></Box>
    </Box>
  );
}
