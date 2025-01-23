export interface Sentence {
  id: number;
  original: string;
  kana: string;
}

export const disabled_keys = ["F12"];

type MetaKeys = Pick<KeyboardEvent, "ctrlKey" | "shiftKey" | "altKey" | "metaKey">;


export type OnInputHandlerParam = {
  char: string;
  metaKeys: MetaKeys;
  remained: Remined;
}
export type OnInputHandler = (param: OnInputHandlerParam) => void;
export type OnStartHandler = () => void;
export type OnFinishedHandler = (score: Score) => void;
export type GameConstructorParam = {
  sentences: Sentence[];
  maxSectionCount?: number;
  playgroundElement: EventTarget;
  onInput?: OnInputHandler;
  onStart?: OnStartHandler;
  onFinished?: OnFinishedHandler;
}

export class Game {

  started_timestamp: number | null = null;
  state: GameState;

  sections: Section[] = [];
  currentSectionIndex: number | null = null;

  handleInput: OnInputHandler = () => { };
  handleStart: OnStartHandler = () => { };
  handleFinished: OnFinishedHandler = () => { };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  events: Map<EventTarget, (...args: any[]) => any> = new Map();

  constructor(param: GameConstructorParam) {
    const { sentences, maxSectionCount = 5 } = param;

    this.isStarted = this.isStarted.bind(this);
    this.isFinished = this.isFinished.bind(this);
    this.destroy = this.destroy.bind(this);
    this.getScore = this.getScore.bind(this);
    this.type = this.type.bind(this);
    this.start = this.start.bind(this);
    this.remained = this.remained.bind(this);

    if (param.onInput) {
      this.handleInput = param.onInput;
    }

    if (param.onStart) {
      this.handleStart = param.onStart;
    }

    if (param.onFinished) {
      this.handleFinished = param.onFinished;
    }


    if (!Array.isArray(sentences)) {
      throw new Error("sentences is not an array");
    }

    if (sentences.length === 0) {
      throw new Error("sentences is empty");
    }

    if (sentences.some((sentence) => sentence.kana === "")) {
      throw new Error("sentence text is empty");
    }

    if (maxSectionCount < 1) {
      throw new Error("maxSectionCount is less than 1");
    }

    console.log(this)

    const pushedSectionIds: number[] = [];
    while (this.sections.length < maxSectionCount) {
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
      if (!pushedSectionIds.includes(randomSentence.id)) {
        this.sections.push(new Section(randomSentence.kana));
        pushedSectionIds.push(randomSentence.id);

        console.log(this.sections)
      }
    }

    const onKeyDown: EventListenerOrEventListenerObject = (event) => {
      const e = event as KeyboardEvent;
      if (!this.isStarted()) {
        return
      }

      const hit_key = e.key.toLowerCase();

      console.log(hit_key)

      if (disabled_keys.includes(hit_key)) {
        return;
      }

      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        return;
      }

      const metaKeys: MetaKeys = {
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      };

      this.type(e.key, metaKeys);
    }

    param.playgroundElement.addEventListener("keydown", (e) => {
      onKeyDown(e);
    });

    this.state = "pending";
  }

  start() {
    this.state = "started";
    this.started_timestamp = Date.now();

    this.currentSectionIndex = 0;
  }

  destroy() {
    this.state = "cancelled";
    this.sections = [];
    this.currentSectionIndex = null;
    this.started_timestamp = null;

    this.handleInput = () => { };
    this.handleStart = () => { };
    this.handleFinished = () => { };

    this.events.forEach((handler, target) => {
      target.removeEventListener("keydown", handler);
    });
  }

  type(char: string, metaKeys: MetaKeys) {

    if (this.state !== "started") {
      throw new Error("Game is not started");
    }

    if (this.currentSectionIndex === null) {
      throw new Error("currentSectionIndex is null");
    }

    const currentSection = this.sections[this.currentSectionIndex];
    if (!currentSection.type(char)) {
      return false;
    }

    if (currentSection.isSolved()) {
      this.currentSectionIndex++;
    }

    this.handleInput({
      char,
      metaKeys,
      remained: this.remained(),
    });

    if (this.currentSectionIndex === this.sections.length) {
      this.state = "finished";
      if (this.handleFinished) {
        this.handleFinished(this.getScore());
      }
    }

    return true;
  }

  remained(): Remined {
    if (this.currentSectionIndex === null) {
      throw new Error("currentSectionIndex is null");
    }

    const currentSection = this.sections[this.currentSectionIndex];
    return currentSection.remined();
  }

  isStarted(): boolean {
    return this.state === "started";
  }

  isFinished(): boolean {
    return this.state === "finished";
  }

  getScore(): Score {
    if (this.started_timestamp === null) {
      throw new Error("started_timestamp is null");
    }

    const time = Date.now() - this.started_timestamp;
    const history = this.sections.map((section) => section.typedStateHistory);

    const totalCharCount = history.reduce((acc, sectionHistory) => acc + sectionHistory.length, 0);
    const missedCharCount = history.reduce((acc, sectionHistory) => {
      return acc + sectionHistory.reduce((acc, typeState) => acc + typeState.missedChars.length, 0);
    }, 0);

    const wpm = Math.floor(totalCharCount / 5 / (time / 1000 / 60));
    const accuracy = Math.floor(((totalCharCount - missedCharCount) / totalCharCount) * 100);

    return {
      time,
      history,
      totalCharCount,
      missedCharCount,
      wpm,
      accuracy,
    };
  }
}


class Section {
  sentence: string;
  expectedCharIndex = 0;

  typedStateHistory: TypeState[] = [];

  constructor(sentence: string) {

    if (sentence === "") {
      throw new Error("sentence is empty");
    }

    this.sentence = sentence;
    this.typedStateHistory = sentence.split("").map((char) => ({
      char,
      missedChars: [],
    }));

    this.expectedCharIndex = 0;
  }

  type(char: string): boolean {
    const expectedChar = this.sentence[this.expectedCharIndex];

    // exclude named key
    if (char.length > 1) {
      return false;
    }

    if (char === expectedChar) {
      this.expectedCharIndex++;
      return true;
    }

    const currentTypedState = this.typedStateHistory[this.expectedCharIndex];
    if (!currentTypedState.missedChars.includes(char)) {
      currentTypedState.missedChars.push(char);
    }

    return false;
  }

  isSolved(): boolean {
    return this.expectedCharIndex === this.sentence.length;
  }

  remined(): Remined {
    return {
      currentChar: this.sentence[this.expectedCharIndex],
      remainedStr: this.sentence.slice(this.expectedCharIndex + 1),
      typedStr: this.sentence.slice(0, this.expectedCharIndex),
    };
  }
}

const GameState = [
  "pending",
  "started",
  "finished",
  "cancelled",
] as const;

export type GameState = typeof GameState[number];


export interface TypeState {
  char: string;
  missedChars: string[];
}

export interface Remined {
  currentChar: string;
  remainedStr: string;
  typedStr: string;
}

export interface Score {
  /** miliseconds */
  time: number;
  wpm: number;
  totalCharCount: number;
  missedCharCount: number;
  accuracy: number;
  history: TypeState[][];
}
