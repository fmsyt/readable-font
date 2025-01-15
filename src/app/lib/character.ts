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


type InputPattern = string[];


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

  const result: InputPattern[] = [[]];

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

    const insertPatternsList: InputPattern[][] = [];


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


    const combinationList: InputPattern[] = [];
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
