import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { nonEmptyArray } from "io-ts-types/lib/nonEmptyArray";
import { component } from "./component";

export const card = t.type({
  components: nonEmptyArray(component),
});

export type Card = D.TypeOf<typeof card>;
