import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [rayInput, setRayInput] = useState("");
  const [result, setResult] = useState();
  const [history, setHistory] = useState([]);

  const addHistory = (value) => {
    setHistory([...history, value]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onSubmit(e);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    history.push(rayInput);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: rayInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      history.push(data.result);
      setRayInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Ask Chat GPT</title>
      </Head>

      <main className={styles.main}>
        <h3>text-davinci-003: an openai GPT 3 model</h3>
        <form onSubmit={onSubmit}>
          <textarea
            name="rayInput"
            rows={5}
            cols={5}
            placeholder="Enter a prompt"
            value={rayInput}
            onChange={(e) => setRayInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input type="submit" value="Ask ChatGPT" />
        </form>
        <div className={styles.result}><pre>{result}</pre></div>
        <hr></hr>
        <div className={styles.history}>
          {history.slice(0, history.length - 1).reverse().map((item, index) => (
            <pre width = "30" key={index}>{item}</pre>
          ))}
        </div>
      </main>
    </div>
  );
}
