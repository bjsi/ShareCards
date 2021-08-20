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
  Template,
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

interface IElementProps {
  comps: SomeCompData[];
  displayState: DisplayState;
}

function ItemPictureElement({
  comps,
  displayState,
}: IElementProps): JSX.Element {
  if (comps.length !== 3) throw new Error("Unexpected number of components");

  return (
    <>
      <div className="grid grid-cols-2">
        <div>{createComponentFromData(comps[0], displayState)}</div>
        <div>{createComponentFromData(comps[1], displayState)}</div>
      </div>
      <div className="grid grid-cols-1">
        <div>{createComponentFromData(comps[2], displayState)}</div>
      </div>
    </>
  );
}

function AudioClozeElement({
  comps,
  displayState,
}: IElementProps): JSX.Element {
  if (comps.length !== 4) throw new Error("Unexpected number of components");

  return (
    <>
      <div className="grid grid-rows-3">
        <div>{createComponentFromData(comps[0], displayState)}</div>

        <div>{createComponentFromData(comps[1], displayState)}</div>

        <div className="grid grid-cols-2">
          <div>{createComponentFromData(comps[2], displayState)}</div>
          <div>{createComponentFromData(comps[3], displayState)}</div>
        </div>
      </div>
    </>
  );
}

function AudioClozePictureElement({
  comps,
  displayState,
}: IElementProps): JSX.Element {
  if (comps.length !== 5) throw new Error("Unexpected number of components");

  return (
    <>
      <div className="grid grid-cols=2">
        <div className="grid grid-rows=3">
          {createComponentFromData(comps[0], displayState)}
        </div>
        <div>{createComponentFromData(comps[1], displayState)}</div>
      </div>
    </>
  );
}

const ItemElement = ({ comps, displayState }: IElementProps): JSX.Element => {
  if (comps.length !== 2) throw new Error("Unexpected number of components");

  return (
    <>
      <div className="grid grid-rows-2">
        <div>
          {comps[0].displayAt & displayState &&
            createComponentFromData(comps[0], displayState)}
        </div>
        <div>
          {comps[1].displayAt & displayState &&
            createComponentFromData(comps[1], displayState)}
        </div>
      </div>
    </>
  );
};

const ElementContainer = ({ components, template }: ElementData) => {
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

  let element: JSX.Element;
  if (template === "Item") {
    element = <ItemElement comps={components} displayState={displayState} />;
  } else if (template === "Item Picture") {
    element = (
      <ItemPictureElement comps={components} displayState={displayState} />
    );
  } else if (template === "Audio Cloze Item") {
    element = (
      <AudioClozeElement comps={components} displayState={displayState} />
    );
  } else if (template === "Audio Cloze Item Picture") {
    element = (
      <AudioClozePictureElement
        comps={components}
        displayState={displayState}
      />
    );
  } else {
    throw new Error("Unexpected template");
  }

  return (
    <>
      <div>{element}</div>
      <div>
        <ElementButtons {...btnProps} />
      </div>
    </>
  );
};

export default ElementContainer;
