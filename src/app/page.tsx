"use client";
import { useState } from "react";
import styles from "./styles.module.css";

async function getData(gush_num: string) {
  try {
    const res = await fetch(`/api/gush/${gush_num}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default function Home() {
  const [gushInput, setGushInput] = useState("");
  const [result, setResult] = useState("");
  const handleClick = async () => {
    const data = await getData(gushInput);
    setResult(JSON.stringify(data.data, null, 2));
  };
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <label className={styles.label}>Gush num</label>
        <input
          className={styles.inputContainer}
          type="number"
          value={gushInput}
          onChange={(e) => setGushInput(e.target.value)}
        ></input>
        <button onClick={handleClick} className={styles.searchButton}>
          Search
        </button>
        <p>{result}</p>
      </div>
    </div>
  );
}
