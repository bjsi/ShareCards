import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { ShowAt } from "./enums/showAt";

const component = t.type({
  showAt: t.union([t.literal(ShowAt.NonQuestion), t.literal(ShowAt.All)]),
});

export type ComponentData = D.TypeOf<typeof component>;

export const htmlComponent = t.intersection([
  component,
  t.type({
    type: t.literal("html"),
    text: t.string,
  }),
]);

export type HtmlComponentData = D.TypeOf<typeof htmlComponent>;

export const imageComponent = t.intersection([
  component,
  t.type({
    type: t.literal("image"),
    src: t.string,
  }),
]);

export type ImageComponentData = D.TypeOf<typeof imageComponent>;

export const soundComponent = t.intersection([
  component,
  t.type({
    type: t.literal("sound"),
    text: t.string,
    src: t.string,
  }),
]);
export type SoundComponentData = D.TypeOf<typeof soundComponent>;

export const answer = <
  T extends
    | typeof htmlComponent
    | typeof imageComponent
    | typeof soundComponent,
>(
  comp: T,
): t.RefinementC<T> => t.refinement(comp, c => c.showAt === ShowAt.NonQuestion);

export const question = <
  T extends
    | typeof htmlComponent
    | typeof imageComponent
    | typeof soundComponent,
>(
  comp: T,
): t.RefinementC<T> => t.refinement(comp, c => c.showAt === ShowAt.All);
