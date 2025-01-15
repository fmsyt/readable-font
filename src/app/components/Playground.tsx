"use client";

import { useState, useMemo } from "react";
import { createInputPatterns } from "../lib/character";

export default function Playground() {

  const [text, setText] = useState("");

  const combination = useMemo(() => {
    const data = createInputPatterns(text);
    return data.map((patterns) => patterns.join(""));
  }, [text]);

  return (
    <div className="w-full max-w-96">
      <h1>Game</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
      />

      <div className="mt-4">
        <ul>
          {combination.map((pattern, index) => (
            <li key={index}>{pattern}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
