"use client";

import { useEffect, useRef, useState } from "react";
import { Game, GameState, Score, type Remined, type Sentence } from "../lib/game";

const sentences: Sentence[] = [
  {
    id: 1,
    original: "隣の客はよく柿食う客だ",
    kana: "となりのきゃくはよくかきくうきゃくだ",
    // kana: createInputPatterns("となりのきゃくはよくかきくうきゃくだ")[0].join(""),
  },
  {
    id: 2,
    original: "庭には二羽鶏がいる",
    kana: "にわにはにわにわとりがいる",
    // kana: createInputPatterns("にわにはにわにわとりがいる")[0].join(""),
  },
];

export default function Playground() {
  const playgroundRef = useRef<HTMLDivElement | null>(null);

  const [text, setText] = useState("");
  const [gameState, setGameState] = useState<GameState>("pending");
  const [score, setScore] = useState<Score|null>(null);

  const [remind, setRemind] = useState<Remined | null>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!playgroundRef.current) {
      return;
    }

    const game = new Game({
      sentences,
      playgroundElement: globalThis,
      maxSectionCount: sentences.length,
      onInput: ({ remained }) => {
        setRemind(remained);
      },
      onStart: () => {
        setGameState("started");
      },
      onFinished: (score) => {
        setGameState("finished");
        setScore(score);
      },
    });

    game.start();

    gameRef.current = game;
    setRemind(game.remained());

    return () => {
      game.destroy();
    };
  }, []);

  return (
    <div ref={playgroundRef} className="w-full max-w-96">
      <h1>Game</h1>
      <p>State: {gameState}</p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
      />
      <div className="mt-4 p-2">
        <span className="text-blue-500">{remind?.typedStr}</span>
        <span className="text-red-500">{remind?.currentChar}</span>
        <span>{remind?.remainedStr}</span>
      </div>
      <div className="mt-4 mockup-code max-h-96 overflow-y-auto">
        <pre>
          <code>{JSON.stringify(score, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
