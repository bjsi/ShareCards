import * as t from "io-ts";
import * as D from "io-ts/Decoder";

export const reactions = t.type({
  "+1": t.number,
  "-1": t.number,
});

export type Reactions = D.TypeOf<typeof reactions>;
