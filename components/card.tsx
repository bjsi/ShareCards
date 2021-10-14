import * as B from "react-bootstrap";
import * as models from "../models/flashcards/cards";
import { ShowAt } from "../models/flashcards/enums/showAt";
import { ShowState } from "../models/flashcards/enums/showState";
import * as R from "react";
import {
  ComponentData,
  HtmlComponentData,
  ImageComponentData,
} from "../models/flashcards/components";

interface ComponentProps {
  show: boolean;
}

interface ElementProps {
  showState: ShowState;
}

interface ItemProps extends ElementProps {
  data: models.Item;
}

interface HtmlCompProps extends ComponentProps {
  text: string;
}

interface ImageCompProps extends ComponentProps {
  src: string;
}

const setVis = (
  show: boolean,
): { visibility: "visible" | "hidden" | "collapse" } => ({
  visibility: show ? undefined : "hidden",
});

const setBorder = (show: boolean) => (show ? "dark" : "none");

const ImageComponent = ({ show, src }: ImageCompProps) => {
  return (
    <B.Image className="img-fluid" src={src} style={{ ...setVis(show) }} />
  );
};

const HtmlComponent = ({ show, text }: HtmlCompProps) => {
  return (
    <B.Card border={setBorder(show)} className="m-1">
      <B.Card.Body>
        <B.Card.Text style={{ ...setVis(show) }}>{text}</B.Card.Text>
      </B.Card.Body>
    </B.Card>
  );
};

const isQuestion = (comp: ComponentData): boolean => comp.showAt === ShowAt.All;
const isAnswer = (comp: ComponentData): boolean => !isQuestion(comp);

const Item = ({ data, showState }: ItemProps) => {
  const q = data.comps.filter(isQuestion)[0];
  const a = data.comps.filter(isAnswer)[0];
  return (
    <>
      <HtmlComponent {...{ show: !!(showState & q.showAt), text: q.text }} />
      <HtmlComponent {...{ show: !!(showState & a.showAt), text: a.text }} />
    </>
  );
};

interface ItemPictureProps extends ElementProps {
  data: models.ItemPicture;
}

const ItemPicture = ({ data, showState }: ItemPictureProps) => {
  const html = data.comps.filter(x => x.type === "html");
  const qHtml = html.filter(isQuestion)[0] as HtmlComponentData;
  const aHtml = html.filter(isAnswer)[0] as HtmlComponentData;
  const img = data.comps.filter(
    x => x.type === "image",
  )[0] as ImageComponentData;
  return (
    <>
      <B.Row>
        <B.Col>
          <HtmlComponent
            {...{ show: !!(showState & qHtml.showAt), text: qHtml.text }}
          />
          <HtmlComponent
            {...{ show: !!(showState & aHtml.showAt), text: aHtml.text }}
          />
        </B.Col>
        <B.Col>
          <ImageComponent
            {...{ show: !!(showState & img.showAt), src: img.src }}
          />
        </B.Col>
      </B.Row>
    </>
  );
};

interface AudioClozeProps {
  data: models.AudioCloze;
}

const AudioCloze = ({ data }: AudioClozeProps) => {
  return <B.Card.Body></B.Card.Body>;
};

interface AudioClozePictureProps {
  data: models.AudioClozePicture;
}

const AudioClozePicture = ({ data }: AudioClozePictureProps) => {
  return <B.Card.Body></B.Card.Body>;
};

interface FlashcardProps {
  data: models.Element;
  isPreview: boolean;
}

interface AnswerButtonsProps {
  showState: ShowState;
  setState: R.Dispatch<R.SetStateAction<ShowState>>;
}

interface ElementButtonProps {
  showState: ShowState;
  showAt: ShowState;
  clickHandler: () => void;
  children: React.ReactNode;
}

const ElementButton = ({
  showState,
  children,
  clickHandler,
  showAt,
}: ElementButtonProps) => {
  return showAt & showState ? (
    <B.Button
      className="m-1 btn-sm d-inline"
      variant="outline-primary"
      onClick={clickHandler}>
      {children}
    </B.Button>
  ) : null;
};

const TestRepetitionButton = ({ setState, showState }: AnswerButtonsProps) => {
  const clickHandler = () => setState(_ => ShowState.Question);
  return (
    <ElementButton
      {...{ showState, showAt: ShowState.Browsing }}
      clickHandler={clickHandler}>
      Test Repetition
    </ElementButton>
  );
};

const CancelRepetitionButton = ({
  setState,
  showState,
}: AnswerButtonsProps) => {
  const clickHandler = () => setState(_ => ShowState.Browsing);
  return (
    <ElementButton
      {...{ showState, showAt: ShowState.Question }}
      clickHandler={clickHandler}>
      Cancel
    </ElementButton>
  );
};

const ShowAnswerButton = ({ setState, showState }: AnswerButtonsProps) => {
  const clickHandler = () => setState(_ => ShowState.Grading);
  return (
    <ElementButton
      {...{ showState, showAt: ShowState.Question }}
      clickHandler={clickHandler}>
      Show Answer
    </ElementButton>
  );
};

const GradingButtons = ({ showState, setState }: AnswerButtonsProps) => {
  const clickHandler = () => setState(_ => ShowState.Browsing);
  return (
    <>
      {[1, 2, 3, 4, 5].map(n => (
        <ElementButton
          {...{ showState, showAt: ShowState.Grading }}
          clickHandler={clickHandler}>
          {n}
        </ElementButton>
      ))}
    </>
  );
};

const ElementButtons = ({ showState, setState }: AnswerButtonsProps) => {
  return (
    <>
      <B.ButtonGroup>
        <span>
          <TestRepetitionButton {...{ showState, setState }} />
        </span>
        <span>
          <ShowAnswerButton {...{ showState, setState }} />
        </span>
        <span>
          <CancelRepetitionButton {...{ showState, setState }} />
        </span>
        <span>
          <GradingButtons {...{ showState, setState }} />
        </span>
      </B.ButtonGroup>
    </>
  );
};

export default function Flashcard({ data, isPreview }: FlashcardProps) {
  const [showState, setShowState] = R.useState(ShowState.Browsing);
  const element = () => {
    switch (data.template) {
      case "Item":
        return <Item {...{ showState, data }} />;
      case "Item Picture":
        return <ItemPicture {...{ showState, data }} />;
      case "Audio Cloze Item":
        return <AudioCloze {...{ showState, data }} />;
      case "Audio Cloze Item Picture":
        return <AudioClozePicture {...{ showState, data }} />;
    }
  };
  return (
    <B.Card border={isPreview ? "light" : "dark"} className="m-1">
      {element()}
      {isPreview || (
        <ElementButtons {...{ setState: setShowState, showState }} />
      )}
    </B.Card>
  );
}
