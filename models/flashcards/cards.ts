import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import {
  soundComponent,
  htmlComponent,
  imageComponent,
  question,
  answer,
} from "./components";

export const item = t.type({
  comps: t.tuple([question(htmlComponent), answer(htmlComponent)]),
  template: t.literal("Item"),
});

export type Item = D.TypeOf<typeof item>;

export const itemPicture = t.type({
  components: t.tuple([
    question(htmlComponent),
    answer(htmlComponent),
    imageComponent,
  ]),
  template: t.literal("Item Picture"),
});

export type ItemPicture = D.TypeOf<typeof itemPicture>;

export const audioCloze = t.type({
  components: t.tuple([
    question(htmlComponent),
    answer(htmlComponent),
    question(soundComponent),
    answer(soundComponent),
  ]),
  template: t.literal("Audio Cloze Item"),
});

export type AudioCloze = D.TypeOf<typeof audioCloze>;

export const audioClozePicture = t.type({
  components: t.tuple([
    question(htmlComponent),
    answer(htmlComponent),
    question(soundComponent),
    answer(soundComponent),
    imageComponent,
  ]),
  template: t.literal("Audio Cloze Item Picture"),
});

export type AudioClozePicture = D.TypeOf<typeof audioClozePicture>;

////TODO: more general case
//export const element = t.type({
//  components: nonEmptyArray(t.union([
//	  htmlComponent,
//	  soundComponent,
//	  imageComponent
//  ])),
//  template: template,
//});

export const element = t.union([
  item,
  itemPicture,
  audioCloze,
  audioClozePicture,
]);

export type Element = D.TypeOf<typeof element>;
