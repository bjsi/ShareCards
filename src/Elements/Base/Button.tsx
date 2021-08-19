import * as R from "react";

const Button = (
  props: R.DetailedHTMLProps<
    R.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => <button type="button" {...props}></button>;

export default Button;
