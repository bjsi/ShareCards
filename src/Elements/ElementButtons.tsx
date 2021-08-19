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

export const ElementButtons = ({
  onTestRepClick,
  onShowAnswerClick,
  onGradeClick,
  onCancelAnswerClick,
  displayState,
}: IElementButtonsProps) => {
  let button;
  if (displayState === DisplayState.Browsing) {
    button = TestRepetitionButton({ onClick: onTestRepClick });
  } else if (displayState === DisplayState.Question) {
    button = ShowAnswerButtons({
      onShowAnswerClick: onShowAnswerClick,
      onCancelAnswerClick: onCancelAnswerClick,
    });
  } else if (displayState === DisplayState.Grading) {
    button = GradeButtons({ onClick: onGradeClick });
  }
  return <>{button}</>;
};
