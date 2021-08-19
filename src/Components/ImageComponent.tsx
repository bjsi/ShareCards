import IComponentProps from "./Base/IComponentProps";

export interface IImageComponentProps extends IComponentProps {
  src: string;
}

export function ImageComponent(props: IImageComponentProps): JSX.Element {
  return <>~~~ Image Component ~~~</>;
}
