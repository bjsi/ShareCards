import DisplayAt from './Components/Base/DisplayAt';

interface IComponentData {
  displayAt: DisplayAt;
}

interface IHtmlComponentData extends IComponentData {
  text: string;
}

type ComponentData = IHtmlComponentData;

export interface ElementData {
  components: ComponentData[];
}

export const data: ElementData[] = [
  {
    components: [
      {
        displayAt: DisplayAt.Question,
        text: 'What is the capital of England?',
      },
      {
        displayAt: DisplayAt.Answer,
        text: 'London',
      },
    ],
  },
];
