import * as R from "react";
import DisplayState from "./Base/DisplayState";
import { ElementButtons, IElementButtonsProps } from "./ElementButtons";
import { ComponentType } from "../Components/Base/ComponentType";
import { HtmlComponent } from "../Components/HtmlComponent";
import { ImageComponent } from "../Components/ImageComponent";
import { SoundComponent } from "../Components/SoundComponent";
import {
  ElementData,
  SomeCompData,
  HtmlData,
  ImageData,
  SoundData,
} from "../TestData";

const createComponentFromData = (
  data: SomeCompData,
  displayState: DisplayState,
): JSX.Element => {
  switch (data.type) {
    case ComponentType.Html:
      return (
        <HtmlComponent {...(data as HtmlData)} displayState={displayState} />
      );
    case ComponentType.Image:
      return (
        <ImageComponent {...(data as ImageData)} displayState={displayState} />
      );
    case ComponentType.Sound:
      return (
        <SoundComponent {...(data as SoundData)} displayState={displayState} />
      );
    default:
      throw new Error("Failed to create component: Unexpected ComponentType.");
  }
};

const Element = ({ components }: ElementData) => {
  const [displayState, setDisplayState] = R.useState<DisplayState>(
    DisplayState.Browsing,
  );

  const btnProps: IElementButtonsProps = {
    onGradeClick: () => setDisplayState(DisplayState.Browsing),
    onShowAnswerClick: () => setDisplayState(DisplayState.Grading),
    onCancelAnswerClick: () => setDisplayState(DisplayState.Browsing),
    onTestRepClick: () => setDisplayState(DisplayState.Question),
    displayState: displayState,
  };

  const toDisplay = components
    .filter(c => c.displayAt & displayState)
    .map(createComponentFromData);

  return (
    <>
      <div>{toDisplay}</div>
      <div>{ElementButtons(btnProps)}</div>
    </>
  );
};

export default Element;
