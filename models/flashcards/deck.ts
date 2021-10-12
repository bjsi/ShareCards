import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { nonEmptyArray } from "io-ts-types/lib/nonEmptyArray";
import { element } from "./cards";

export const deckData = t.type({
  title: t.string,
  author: t.string,
  elements: nonEmptyArray(element),
});

export type Deck = D.TypeOf<typeof deckData>;
