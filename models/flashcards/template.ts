import * as t from "io-ts";
import * as D from "io-ts/Decoder";

export const template = t.union([
  t.literal("Audio Cloze Item Picture"),
  t.literal("Audio Cloze Item"),
  t.literal("Item Picture"),
  t.literal("Item"),
]);

export type Template = D.TypeOf<typeof template>;
