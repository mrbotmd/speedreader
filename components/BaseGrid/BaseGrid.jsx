import { Box } from "@mui/material";
import React from "react";

export function BaseGrid({ children, sx, ...rest }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(24, 1fr)",
        gridTemplateRows: "repeat(24, 1fr)",
        overflow: "hidden",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
