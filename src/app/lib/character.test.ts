import { createInputPatterns, expandPatterns } from "./character";

describe("Text", () => {

  const makeTestCases = (text: string, expected: string[]) => {
    const patternsList = createInputPatterns(text);
    const patternsStringList = patternsList.map((patterns) => patterns.join("")).sort();

    return [ patternsStringList, expected.sort() ] as const;
  }

  it("あんこ", () => {
    const [ patternsStringList, expected ] = makeTestCases(
      "あんこ",
      [
        "anko",
        "annko",
        "axnko",
        "anco",
        "annco",
        "axnco",
      ]
    );

    expect(patternsStringList).toEqual(expected);
  });

  it("アンコール", () => {
    const [ patternsStringList, expected ] = makeTestCases(
      "アンコール",
      [
        "anko-ru",
        "annko-ru",
        "axnko-ru",
        "anco-ru",
        "annco-ru",
        "axnco-ru",
      ]
    );

    expect(patternsStringList).toEqual(expected);
  });

  it("ちゃんと", () => {

    const [ patternsStringList, expected ] = makeTestCases(
      "ちゃんと",
      [
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
      ]
    );

    expect(patternsStringList).toEqual(expected);
  });

  it("あっと", () => {
    const [ patternsStringList, expected ] = makeTestCases("あっと", [ "atto" ]);
    expect(patternsStringList).toEqual(expected);
  });

  it("だっっさ", () => {
    const [ patternsStringList, expected ] = makeTestCases("だっっさ", [ "dasssa" ]);
    expect(patternsStringList).toEqual(expected);
  });

  it("らっきょ", () => {
    const [ patternsStringList, expected ] = makeTestCases(
      "らっきょ",
      [
        "rakkyo",
        "rakkilyo",
        "rakkixyo",
      ]
    );

    expect(patternsStringList).toEqual(expected);
  });

  it("あびゃびゃ", () => {
    const [ patternsStringList, expected ] = makeTestCases(
      "あびゃびゃ",
      [
        "abyabya",
        "abyabilya",
        "abyabixya",

        "abilyabya",
        "abilyabilya",
        "abilyabixya",

        "abixyabya",
        "abixyabilya",
        "abixyabixya",
      ]
    );

    expect(patternsStringList).toEqual(expected);
  })

  it("numbers", () => {
    // NOTE: '0' → '-' の順番で入力すると、'ー' が '－' になる
    const [ patternsStringList, expected ] = makeTestCases(
      "１２３４５６７８９０",
      [
        "1234567890",
      ]
    );

    expect(patternsStringList).toEqual(expected);
  });

  it("characters", () => {
    // NOTE: '0' → '-' の順番で入力すると、'ー' が '－' になる
    // NOTE: 「`」 をテストに含めるとエラーになるので除外
    const [ patternsStringList, expected ] = makeTestCases(
      "～ー＝！＠＃＄％＾＆＊（）＿＋「」￥｛｝｜；’：”、。・＜＞？　",
      [
        "~-=!@#$%^&*()_+[]\\{}|;':\",./<>? ",
      ]
    );

    expect(patternsStringList).toEqual(expected);
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
