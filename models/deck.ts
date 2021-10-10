import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";
import { nonEmptyArray } from "io-ts-types/lib/nonEmptyArray";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import { element } from './card';

export const deck = t.type({
  title: NonEmptyString,
  author: NonEmptyString,
  username: NonEmptyString,
  repository: NonEmptyString,
  description: optionFromNullable(t.string),
  elements: nonEmptyArray(element),
  // version, created, updated, release notes...
});

export type Deck = D.TypeOf<typeof deck>;
