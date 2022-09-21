import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { NextToReadText } from "../components/NextToReadText";
import { Reader } from "../components/Reader";
import styles from "../styles/Home.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { BaseGrid } from "../components/BaseGrid";

export default function Home() {
  const [readingPhase, setReadingPhase] = useState(false);
  const [nextToReadText, setNextToReadText] = useState("");

  const startReading = (text) => {
    setNextToReadText(text);
    setReadingPhase(true);
  };

  if (readingPhase)
    return (
      <BaseGrid>
        <IconButton
          disabled={false}
          size="medium"
          onClick={() => setReadingPhase(false)}
          title="Вернуться к вводу текста"
          sx={{
            gridColumnStart: "7",
            gridColumnEnd: "8",
            gridRowStart: "2",
            gridRowEnd: "3",
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Reader textToRead={nextToReadText} />
      </BaseGrid>
    );
  if (!readingPhase)
    return (
      <BaseGrid>
        <NextToReadText
          startReading={startReading}
          sx={{
            gridColumnStart: "8",
            gridColumnEnd: "18",
            gridRowStart: "8",
            gridRowEnd: "16",
          }}
        />
      </BaseGrid>
    );
}
