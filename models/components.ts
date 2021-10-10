import * as t from "io-ts";
import * as D from "io-ts/Decoder";

export const enum ShowState {
  Question = 1 << 0,
  Grading = 1 << 1,
  Browsing = 1 << 2,
}

export const enum ShowAt {
  NonQuestion = ShowState.Grading | ShowState.Browsing,
  All = ShowState.Question | ShowState.Browsing | ShowState.Grading,
}


const component =
  t.type({
    showAt: t.union([
	t.literal(ShowAt.NonQuestion),
	t.literal(ShowAt.All),
    ]),
  });

export type Component = D.TypeOf<typeof component>;

export const htmlComponent = t.intersection([
  component,
  t.type({
    type: t.literal("html"),
    text: t.string
  })
])

export type HtmlComponent = D.TypeOf<typeof htmlComponent>;

export const imageComponent = t.intersection([
    component,
    t.type({
    type: t.literal("image"),
    src: t.string,
  })
])

export type ImageComponent = D.TypeOf<typeof imageComponent>;

export const soundComponent = t.intersection([
  component,
  t.type({
    type: t.literal("sound"),
    text: t.string,
    src: t.string,
  })
])
export type SoundComponent = D.TypeOf<typeof soundComponent>;

export const answer = (comp: typeof htmlComponent | typeof imageComponent | typeof soundComponent) => t.refinement(comp, c => c.showAt === ShowAt.NonQuestion);

export const question = (comp: typeof htmlComponent | typeof imageComponent | typeof soundComponent) => t.refinement(comp, c => c.showAt === ShowAt.All); 
