import { Card, Button } from "react-bootstrap";
import * as models from "../models/flashcards/cards";
import { ShowAt } from "../models/flashcards/enums/showAt";
import { ShowState } from "../models/flashcards/enums/showState";
import * as R from "react";

interface ComponentProps {
  showState: ShowState;
  showAt: ShowAt;
}

interface ElementProps {
  showState: ShowState;
}

interface ItemProps extends ElementProps {
  data: models.Item;
}

const shouldHideComponent = (showState: ShowState, showAt: ShowAt) => {
  return showAt & showState ? undefined : "none";
};

interface HtmlCompProps extends ComponentProps {
  text: string;
}

// interface ImageCompProps extends ComponentProps {
//   src: string;
// }

// const ImageComponent = ({showState, showAt, src}: ImageCompProps) => {
//   return (
//     <img>
//     </img>
//   )
// }

const HtmlComponent = ({ showState, showAt, text }: HtmlCompProps) => {
  return (
    <Card
      border="dark"
      style={{ display: shouldHideComponent(showState, showAt) }}
      className="m-1">
      <Card.Body>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Item = ({ data, showState }: ItemProps) => {
  return (
    <>
      {data.comps.map((comp, idx) => (
        <HtmlComponent
          {...{ key: idx, showState, showAt: comp.showAt, text: comp.text }}
        />
      ))}
    </>
  );
};

interface ItemPictureProps extends ElementProps {
  data: models.ItemPicture;
}

const ItemPicture = ({ data, showState }: ItemPictureProps) => {
  return <Card.Body></Card.Body>;
};

interface AudioClozeProps {
  data: models.AudioCloze;
}

const AudioCloze = ({ data }: AudioClozeProps) => {
  return <Card.Body></Card.Body>;
};

interface AudioClozePictureProps {
  data: models.AudioClozePicture;
}

const AudioClozePicture = ({ data }: AudioClozePictureProps) => {
  return <Card.Body></Card.Body>;
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
    <Button className="m-1" onClick={clickHandler}>
      {children}
    </Button>
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

const ElementButtons = ({ showState, setState }: AnswerButtonsProps) => {
  return (
    <span>
      <TestRepetitionButton {...{ showState, setState }} />
      <ShowAnswerButton {...{ showState, setState }} />
    </span>
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
    <Card border={isPreview ? "light" : "dark"} className="m-1">
      {element()}
      {isPreview || (
        <ElementButtons {...{ setState: setShowState, showState }} />
      )}
    </Card>
  );
}
