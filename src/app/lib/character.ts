import { ContractedSound, KeyMap, SymbolMap, Vowel } from "../types";
import katakanaToHiragana from "./toHiragana";

export const KeyInputMap = (() => {
  const map = new Map<string, readonly string[]>();

  for (const [pattern, kana] of Object.entries(KeyMap)) {
    if (kana === null || kana === undefined) {
      continue;
    }

    const current = map.get(kana);
    if (!current) {
      map.set(kana, [pattern]);
      continue;
    }

    map.set(kana, [...current, pattern]);
  }

  for (const [pattern, kana] of Object.entries(SymbolMap)) {
    if (kana === null || kana === undefined) {
      continue;
    }

    const current = map.get(kana);
    if (!current) {
      map.set(kana, [pattern]);
      continue;
    }

    map.set(kana, [...current, pattern]);
  }

  return map;
})();


type Node = {
  children: CharacterNode[];
}

type InputTree = Node;

type CharacterNode = Node & {
  char: string;
  patterns: InputPatterns;
  parents: CharacterNode[] | null;
}

type InputPatterns = string[];



export function createInputPatternTree(text: string) {
  const t = katakanaToHiragana(text);

  let carryっ = 0;

  const tree: InputTree = {
    children: [],
  }

  let lastTailNodes: CharacterNode[] = [];

  /** parentsに追加される対象を管理 */
  let tailNodes: CharacterNode[] = [tree as CharacterNode];

  for (let i = 0; i < text.length; i++) {

    const char = t[i];
    if (char === "っ") {
      carryっ++;
      continue;
    }

    const nextChar = t[i + 1];

    const p1 = KeyInputMap.get(char);
    if (!p1) {
      continue;
    }

    const insertPatternsList: InputPatterns[][] = [];

    lastTailNodes = tailNodes;
    tailNodes = [];


    if (carryっ && Vowel.includes(char)) {
      throw new Error("'っ' の後に母音が来ることはありません。");
    }

    let insertedNode: CharacterNode | null = null;
    if (!ContractedSound.includes(nextChar)) {

      const node: CharacterNode = {
        char,
        patterns: char === "ん" && !Vowel.includes(nextChar) ? ["n", ...p1] : [...p1],
        parents: lastTailNodes,
        children: [],
      }

      for (const parent of lastTailNodes) {
        parent.children.push(node);
      }

      insertPatternsList.push([node.patterns]);

      insertedNode = node;
      tailNodes.push(node);

    } else {

      const p2 = KeyInputMap.get(nextChar);
      const p3 = KeyInputMap.get(char + nextChar);

      if (p3) {
        // "ちゃ"
        insertPatternsList.push([[...p3]]);

        const node: CharacterNode = {
          char: char + nextChar,
          patterns: [...p3],
          parents: lastTailNodes,
          children: [],
        }

        for (const parent of lastTailNodes) {
          parent.children.push(node);
        }

        insertedNode = node;
        tailNodes.push(node);
      }

      if (p2) {
        // "ち", "ゃ"
        insertPatternsList.push([[...p1], [...p2]]);

        const item1: CharacterNode = {
          char,
          patterns: [...p1],
          parents: lastTailNodes,
          children: [],
        }

        const item2: CharacterNode = {
          char: nextChar,
          patterns: [...p2],
          parents: [item1],
          children: [],
        }

        item1.children.push(item2);

        for (const parent of lastTailNodes) {
          parent.children.push(item1);
        }

        insertedNode = item1;
        tailNodes.push(item2);
      }

      i++;
    }

    if (carryっ && insertedNode) {
      const firstString = insertedNode.patterns[0];
      const firstChar = firstString[0];

      // carry の数だけfirstCharを重ねる
      const prependString = Array(carryっ).fill(firstChar).join("");
      insertedNode.patterns[0] = prependString + firstString;
      insertedNode.char = Array(carryっ).fill("っ").join("") + insertedNode.char;

      carryっ = 0;
    }

  }

  return tree;
}

export function createInputPatterns(text: string): InputPatterns[] {
  const tree = createInputPatternTree(text);

  function traverse(node: CharacterNode, carry: InputPatterns = []) {
    // const carryList = node.patterns.map(p => carry + p);
    const carryList = node.patterns.map((p) => [...carry, p]);

    if (node.children.length === 0) {
      return carryList;
    }

    let result: InputPatterns[] = [];
    for (const child of node.children) {
      for (const carry of carryList) {
        result.push(...traverse(child, carry));
      }
    }

    return result;
  }

  const result: InputPatterns[] = [];
  for (const child of tree.children) {
    result.push(...traverse(child));
  }

  return result;
}
