import DisplayAt from "./Components/Base/DisplayAt";
import PlayAt from "./Components/Base/PlayAt";
import { ComponentType } from "./Components/Base/ComponentType";

interface CompData {
  type: ComponentType;
  displayAt: DisplayAt;
}

export interface HtmlData extends CompData {
  text: string;
}

export interface ImageData extends CompData {
  src: string;
}

export interface SoundData extends CompData {
  text: string;
  src: string;
  playAt: PlayAt;
}

export type SomeCompData = HtmlData | ImageData | SoundData;

export interface ElementData {
  template?: string;
  components: SomeCompData[];
}

export const data: ElementData[] = [
  {
    //
    // Simple Html QA

    components: [
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.All,
        text: "What is the capital of England?",
      },
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.NonQuestion,
        text: "London",
      },
    ],
  },
  {
    //
    // QA with Image

    components: [
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.All,
        text: "Which capital is shown in the picture?",
      },
      {
        type: ComponentType.Image,
        displayAt: DisplayAt.All,
        src: "",
      },
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.NonQuestion,
        text: "London",
      },
    ],
  },
  {
    //
    // Audio Cloze

    components: [
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.All,
        text: "Fill in the gap:",
      },
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.NonQuestion,
        text: "the answer",
      },
      {
        type: ComponentType.Sound,
        displayAt: DisplayAt.All,
        text: "Audio Cloze Question",
        playAt: PlayAt.Question,
      },
      {
        type: ComponentType.Sound,
        displayAt: DisplayAt.NonQuestion,
        playAt: PlayAt.Answer,
        text: "Audio Cloze Answer",
      },
    ],
  },
];
