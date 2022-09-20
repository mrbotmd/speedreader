import { useState } from "react";
import { NextToReadText } from "../components/NextToReadText";
import { Reader } from "../components/Reader";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [readingPhase, setReadingPhase] = useState(false);
  const [nextToReadText, setNextToReadText] = useState("");

  const startReading = (text) => {
    setNextToReadText(text);
    setReadingPhase(true);
  };

  if (readingPhase) return <Reader textToRead={nextToReadText} />;
  if (!readingPhase)
    return (
      <div className={styles.container}>
        <NextToReadText startReading={startReading} />
      </div>
    );
}
