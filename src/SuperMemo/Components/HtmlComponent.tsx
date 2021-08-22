import IComponentProps from "./Base/IComponentProps";

export interface IHtmlComponentProps extends IComponentProps {
  text: string;
}

export function HtmlComponent(props: IHtmlComponentProps): JSX.Element {
  return (
    <p
      style={{ border: "1px solid grey", padding: "2px" }}
      className="text-black-800 m-1">
      {props.text}
    </p>
  );
}
