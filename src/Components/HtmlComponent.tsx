import IComponentProps from "./Base/IComponentProps";

export interface IHtmlComponentProps extends IComponentProps {
  text: string;
}

export function HtmlComponent(props: IHtmlComponentProps): JSX.Element {
  return <>{props.text}</>;
}
