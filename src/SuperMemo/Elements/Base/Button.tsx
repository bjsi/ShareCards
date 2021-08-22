import * as R from "react";

const Button = (
  props: R.DetailedHTMLProps<
    R.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => <button className="ml-1 mr-1" type="button" {...props}></button>;

export default Button;
