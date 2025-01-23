"use client";

import { useEffect, useRef, useState } from "react";
import { Game, type Remined, type Sentence } from "../lib/game";

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

  const [remind, setRemind] = useState<Remined | null>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!playgroundRef.current) {
      return;
    }

    console.log(playgroundRef.current);

    const game = new Game({
      sentences,
      playgroundElement: globalThis,
      maxSectionCount: sentences.length,
      onInput: ({ remained }) => {
        setRemind(remained);
      },
      onStart: () => {
        console.log("start");
      },
      onFinished: (score) => {
        console.log("finished", score);
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
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
      />
      <div className="mt-4 mockup-code max-h-96 overflow-y-auto">
        <pre>
          <code>{JSON.stringify(remind, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
