import { ContractedSound, KeyMap, Vowel } from "../types";
import katakanaToHiragana from "./toHiragana";

export const KeyInputMap = (() => {
  const map = new Map<string, string[]>();

  for (const [pattern, kana] of Object.entries(KeyMap)) {
    if (kana === null || kana === undefined) {
      continue;
    }

    const item = map.get(kana);
    if (!item) {
      map.set(kana, [pattern]);
      continue;
    }

    item.push(pattern);
  }

  return map;
})();

export function getInputPattern(char: string) {

  console.log("char", char);

  const result = [];

  const keywords: string[] = [];
  for (let i = 0; i < char.length; i++) {
    if (i === 0) {
      keywords.push(char[i]);
    } else {
      keywords.push(keywords[i - 1] + char[i]);
    }
  }

  for (const keyword of keywords) {
    const patterns = KeyInputMap.get(keyword);
    if (!patterns) {
      return null;
    }

    result.push(patterns);
  }

  console.log(char, result);

  return result;
}

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

  const result: InputPattern[] = [[]];

  for (let i = 0; i < text.length; i++) {

    const char = t[i];
    const nextChar = t[i + 1];

    const p1 = KeyInputMap.get(char);
    if (!p1) {
      continue;
    }

    const insertPatternsList: InputPattern[][] = [];


    if (!ContractedSound.includes(nextChar)) {

      if (char === "ん" && !Vowel.includes(nextChar)) {
        insertPatternsList.push([["n", ...p1]]);
      } else {
        insertPatternsList.push([p1]);
      }

    } else {

      const p2 = KeyInputMap.get(nextChar);
      const p3 = KeyInputMap.get(char + nextChar);

      if (p3) {
        insertPatternsList.push([p3]);
      }

      if (p2) {
        insertPatternsList.push([p1, p2]);
      }

      i++;
    }

    const appendCount = insertPatternsList.reduce((acc, cur) => acc + Math.max(...cur.map(p => p.length)), 0);
    if (appendCount > 1) {
      const copy = JSON.stringify(result);
      for (let j = 0; j < appendCount - 1; j++) {
        result.push(...JSON.parse(copy));
      }
    }


    const combinationList: InputPattern[] = [];
    for (const patterns of insertPatternsList) {

      const maxSize = Math.max(...patterns.map(p => p.length));

      for (let j = 0; j < maxSize; j++) {

        const list: InputPattern = [];

        for (let k = 0; k < patterns.length; k++) {
          const pattern = patterns[k];
          if (!pattern) {
            continue;
          }

          list.push(pattern[j % pattern.length]);
        }

        combinationList.push(list);

      }

    }

    for (let j = 0; j < result.length; j++) {
      const p = combinationList[j % combinationList.length];
      result[j].push(...p);
    }
  }

  return result;
}
