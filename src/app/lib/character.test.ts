import { createInputPatterns, expandPatterns } from "./character";

describe("Text", () => {
  it("ちゃんと", () => {
    const patternsList = createInputPatterns("ちゃんと");
    const patternsStringList = patternsList.map((patterns) => patterns.join("")).sort();

    expect(patternsStringList).toEqual([
      "chanto",
      "channto",
      "chaxnto",
      "tyanto",
      "tyannto",
      "tyaxnto",
      "cyanto",
      "cyannto",
      "cyaxnto",
      "tilyanto",
      "tilyannto",
      "tilyaxnto",
      "chilyanto",
      "chilyannto",
      "chilyaxnto",
      "tixyanto",
      "tixyannto",
      "tixyaxnto",
      "chixyanto",
      "chixyannto",
      "chixyaxnto",
    ].sort());
  });
});

describe("expandPatterns", () => {
  it("should expand patterns correctly", () => {
    const patternsList = [["a", "b"], ["c", "d"]];
    const expanded = expandPatterns(patternsList);
    const expected = [
      ["a", "c"],
      ["a", "d"],
      ["b", "c"],
      ["b", "d"],
    ];

    expect(expanded).toEqual(expected);
  });
});
