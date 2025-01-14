import { createInputPatterns } from "./character";

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
