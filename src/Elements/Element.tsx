import * as R from "react";
import DisplayState from "./Base/DisplayState";
import { ElementButtons, IElementButtonsProps } from "./ElementButtons";
import { HtmlComponent } from "../Components/HtmlComponent";
import { ElementData } from "../TestData";

function Element({ components }: ElementData) {
  const [displayState, setDisplayState] = R.useState<DisplayState>(
    DisplayState.Browsing,
  );
  const callbacks: IElementButtonsProps = {
    onGradeClick: () => setDisplayState(DisplayState.Browsing),
    onShowAnswerClick: () => setDisplayState(DisplayState.Grading),
    onTestRepClick: () => setDisplayState(DisplayState.Question),
    displayState: displayState,
  };

  const displayedComponents = components
    .filter(c => (c.displayAt & displayState) != 0)
    .map(c => HtmlComponent({ ...c, displayState }));

  return (
    <>
      {displayedComponents}
      {ElementButtons(callbacks)}
    </>
  );
}

export default Element;
