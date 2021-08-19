import IComponentProps from "./Base/IComponentProps";
import PlayAt from "./Base/PlayAt";

export interface ISoundComponentProps extends IComponentProps {
  src: string;
  playAt: PlayAt;
}

export function SoundComponent(props: ISoundComponentProps): JSX.Element {
  return <>~~~ Sound Component ~~~</>;
}
