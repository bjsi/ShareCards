import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";

export const component = t.type({
  type: t.string,
});

export type Component = D.TypeOf<typeof component>;
