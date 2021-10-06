import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";
import { nonEmptyArray } from "io-ts-types/lib/nonEmptyArray";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import { card } from "./card";

export const deck = t.type({
  title: NonEmptyString,
  author: NonEmptyString,
  description: optionFromNullable(t.string),
  cards: nonEmptyArray(card),
  // version, created, updated, release notes...
});

export type Deck = D.TypeOf<typeof deck>;
