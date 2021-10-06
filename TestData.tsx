import DisplayAt from "./SuperMemo/Components/Base/DisplayAt";
import PlayAt from "./SuperMemo/Components/Base/PlayAt";
import { ComponentType } from "./SuperMemo/Components/Base/ComponentType";

interface CompData {
  type: ComponentType;
  displayAt: DisplayAt;
  height?: number;
  width?: number;
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

export type Template =
  | "Item"
  | "Item Picture"
  | "Audio Cloze Item"
  | "Audio Cloze Item Picture";

export interface ElementData {
  template: Template;
  components: SomeCompData[];
}

export const elData: ElementData[] = [
  {
    //
    // Simple Html QA

    template: "Item",
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

    template: "Item Picture",
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

    template: "Audio Cloze Item",
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
