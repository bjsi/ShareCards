import { Element } from "../models/flashcards/cards";

export function uniqueByKey<T, A>(list: T[], getter: (item: T) => A) {
  const set = new Set<A>();
  return list.filter(x => {
    const key = getter(x);
    const ret = !set.has(key);
    set.add(key);
    return ret;
  });
}

export type CardPredicate = (card: Element) => boolean;

const hasComponentType = (card: Element, type: string) =>
  card.comps.some(comp => comp.type === type);

export const hasImage = (card: Element) => hasComponentType(card, "image");
export const hasSound = (card: Element) => hasComponentType(card, "sound");
