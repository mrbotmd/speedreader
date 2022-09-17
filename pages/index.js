import { Box } from "@mui/material";
import { Reader } from "../components/Reader";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          width: "50%",
          left: "0",
          border: "1px solid blue",
        }}
      ></Box>
      <Reader />
    </div>
  );
}
