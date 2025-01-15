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

        tailNodes.push(node);

        for (const parent of lastTailNodes) {
          parent.children.push(node);
        }
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

        tailNodes.push(item2);
      }

      i++;
    }

    if (carryっ) {

      for (const tail of tailNodes) {
        const firstString = tail.patterns[0];
        const firstChar = firstString[0];

        // carry の数だけfirstCharを重ねる
        const prependString = Array(carryっ).fill(firstChar).join("");
        tail.patterns[0] = prependString + firstString;
        tail.char = Array(carryっ).fill("っ").join("") + tail.char;
      }

      carryっ = 0;
    }

  }

  return tree;
}


/**
 * ex) パンツ
 *
 * ```
 * [
 *    ["pa", "nn", "tu"],
 *    ["pa", "nn", "tsu"],
 * ]
 */
export function createInputPatterns(text: string) {
  const t = katakanaToHiragana(text);

  let carryっ = 0;

  const result: InputPatterns[] = [[]];

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


    if (carryっ && Vowel.includes(char)) {
      throw new Error("'っ' の後に母音が来ることはありません。");
    }

    if (!ContractedSound.includes(nextChar)) {

      if (char === "ん" && !Vowel.includes(nextChar)) {
        insertPatternsList.push([["n", ...p1]]);
      } else {
        insertPatternsList.push([[...p1]]);
      }

    } else {

      const p2 = KeyInputMap.get(nextChar);
      const p3 = KeyInputMap.get(char + nextChar);

      if (p3) {
        // "ちゃ"
        insertPatternsList.push([[...p3]]);
      }

      if (p2) {
        // "ち", "ゃ"
        insertPatternsList.push([[...p1], [...p2]]);
      }

      i++;
    }

    if (carryっ) {

      for (const patterns of insertPatternsList) {
        const firstString = patterns[0][0];
        const firstChar = firstString[0];

        // carry の数だけfirstCharを重ねる
        const prepend = Array(carryっ).fill(firstChar).join("");
        patterns[0][0] = prepend + firstString;
      }

      carryっ = 0;
    }

    // const appendCount = insertPatternsList.reduce((acc, cur) => acc + Math.max(...cur.map(p => p.length)), 0);
    const appendCount = insertPatternsList.reduce((acc, cur) => {
      const combinationCount = cur.reduce((acc, cur) => acc * cur.length, 1);
      return acc + combinationCount;
    }, 0);

    if (appendCount > 1) {
      const copy = JSON.stringify(result);
      for (let j = 0; j < appendCount - 1; j++) {
        result.push(...JSON.parse(copy));
      }
    }


    const combinationList: InputPatterns[] = [];
    for (const patterns of insertPatternsList) {
      combinationList.push(...expandPatterns(patterns));
    }

    for (let j = 0; j < result.length; j++) {
      const p = combinationList[j % combinationList.length];
      result[j].push(...p);
    }
  }

  return result;
}

/**
 * Expand patterns list.
 * ex) [[a, b], [c, d]] => [[a, c], [a, d], [b, c], [b, d]]
 */
export function expandPatterns<T>(patternsList: T[][]): T[][] {
  if (patternsList.length === 0) return [[]];

  const [first, ...rest] = patternsList;
  const restExpanded = expandPatterns(rest);

  const result: T[][] = [];
  for (const item of first) {
    for (const expanded of restExpanded) {
      result.push([item, ...expanded]);
    }
  }

  return result;
}
