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
    components: [
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.All,
        text: "What is the capital of China?",
      },
      {
        type: ComponentType.Html,
        displayAt: DisplayAt.NonQuestion,
        text: "Shanghai",
      },
    ],
  },
  {
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
];
