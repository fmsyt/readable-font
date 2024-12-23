import { createContext } from "react";

export type GameStatus = "loading" | "playing" | "finished";

export type GameContextType = {
  status: GameStatus;
  reload: () => void;
};

export const GameContext = createContext<GameContextType>({
  status: "loading",
  reload: () => { throw new Error("GameContext not implemented"); },
});
