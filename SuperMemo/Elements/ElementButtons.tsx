import Button from "./Base/Button";
import DisplayState from "../Elements/Base/DisplayState";

interface IElementButtonProps {
  onClick: () => void;
}

const TestRepetitionButton = ({ onClick }: IElementButtonProps) => {
  return (
    <>
      <Button onClick={onClick}>Test Repetition</Button>
    </>
  );
};

interface IShowAnswerButtonsProps {
  onCancelAnswerClick: () => void;
  onShowAnswerClick: () => void;
}

const ShowAnswerButtons = ({
  onCancelAnswerClick,
  onShowAnswerClick,
}: IShowAnswerButtonsProps) => {
  return (
    <>
      <Button onClick={onShowAnswerClick}>Show Answer</Button>
      <Button onClick={onCancelAnswerClick}>Cancel</Button>
    </>
  );
};

const GradeButtons = ({ onClick }: IElementButtonProps) => {
  return (
    <>
      <Button onClick={onClick}>1 :(</Button>
      <Button onClick={onClick}>2 :/</Button>
      <Button onClick={onClick}>3 :)</Button>
    </>
  );
};

export interface IElementButtonsProps {
  onTestRepClick: () => void;
  onShowAnswerClick: () => void;
  onCancelAnswerClick: () => void;
  onGradeClick: () => void;
  displayState: DisplayState;
}

const createElementButtons = (props: IElementButtonsProps) => {
  switch (props.displayState) {
    case DisplayState.Browsing:
      return <TestRepetitionButton onClick={props.onTestRepClick} />;
    case DisplayState.Question:
      return (
        <ShowAnswerButtons
          onCancelAnswerClick={props.onCancelAnswerClick}
          onShowAnswerClick={props.onShowAnswerClick}
        />
      );
    case DisplayState.Grading:
      return <GradeButtons onClick={props.onGradeClick} />;

    default:
      throw new Error(
        "Failed to create element buttons: Unexpected display state.",
      );
  }
};

export const ElementButtons = (props: IElementButtonsProps) => {
  return <span className="mb-2">{createElementButtons(props)}</span>;
};
