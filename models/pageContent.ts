import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";

const metaData = t.type({
  title: t.string,
  desc: optionFromNullable(t.string),
});

export type MetaData = D.TypeOf<typeof metaData>;
