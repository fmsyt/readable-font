import { createInputTree, InputTree } from "./character";

export function initGame(text: string) {
  let tree: InputTree | null = createInputTree(text);
  let isActive = true;

  const handleInput = (input: string) => {
    if (!isActive) {
      throw new Error("Game is not active");
    }
    console.log(input);
    return 1;
  }

  const handleQuit = () => {
    isActive = false;
    tree = null;
  }

  return {
    handleInput,
    handleQuit,
  }
}
