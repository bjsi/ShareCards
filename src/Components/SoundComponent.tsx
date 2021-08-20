import IComponentProps from "./Base/IComponentProps";
import DisplayState from "../Elements/Base/DisplayState";
import * as R from "react";
import PlayAt from "./Base/PlayAt";
import Button from "../Elements/Base/Button";

export interface ISoundComponentProps extends IComponentProps {
  src: string;
  text: string;
  playAt: PlayAt;
}

interface ISoundButtonProps {
  playing: boolean;
  onClick: () => void;
}

const ToggleButton = ({ playing, onClick }: ISoundButtonProps) => {
  return (
    <>
      <Button onClick={onClick}>{playing ? "⏸️" : "▶️"}</Button>
    </>
  );
};

export function SoundComponent({
  text,
  displayState,
}: ISoundComponentProps): JSX.Element {
  const [playing, setPlayState] = R.useState(
    displayState === DisplayState.Question,
  );
  const togglePlay = () => setPlayState(!playing);
  return (
    <>
      <div>{text}</div>
      <div>-[{playing ? "PLAY" : "STOP"}]---------</div>
      <div>
        <ToggleButton playing={playing} onClick={togglePlay} />
      </div>
    </>
  );
}
