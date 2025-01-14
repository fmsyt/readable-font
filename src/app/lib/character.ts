import { ContractedSound, KeyMap } from "../types";
import katakanaToHiragana from "./toHiragana";

export const KeyInputMap = (() => {
  const map = new Map<string, string[]>();

  [...Object.entries(KeyMap)].forEach(([pattern, kana]) => {
    if (kana === null || kana === undefined) {
      return;
    }

    const item = map.get(kana);
    if (!item) {
      map.set(kana, [pattern]);
      return;
    }

    item.push(pattern);

  });

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

  let result: string[][] = [ [] ];

  for (let i = 0; i < text.length; i++) {

    const char = t[i];

    const patterns = KeyInputMap.get(char);
    if (!patterns) {
      continue;
    }

    console.log(char, patterns);

    if (patterns.length > 1) {
      const copy = JSON.parse(JSON.stringify(result));
      for (let j = 0; j < patterns.length - 1; j++) {
        result = [
          ...result,
          ...copy
        ]
      }
    }

    for (let j = 0; j < result.length; j++) {
      const pattern = patterns[j % patterns.length];
      result[j].push(pattern);
    }
    console.log("result", result.length, result);
  }

  return result;
}
