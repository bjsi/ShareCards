import * as F from "fp-ts/lib/function";
import { contramap, Ord } from "fp-ts/Ord";
import * as N from "fp-ts/lib/number";
import { PublishedDeck } from "../models/publishedDeck";
import { reverse } from "fp-ts/Ord";
import * as D from "fp-ts/lib/Date";
import { Element } from "../models/flashcards/cards";

export type SortDirection = <A>(ord: Ord<A>) => Ord<A>;
export const asc: SortDirection = <A>(ord: Ord<A>) => ord;
export const desc: SortDirection = <A>(ord: Ord<A>) => reverse(ord);

export type Sorter<A> = (dir: SortDirection) => Ord<A>;

// Decks
export const byStars: Sorter<PublishedDeck> = (dir: SortDirection) =>
  F.pipe(
    dir(N.Ord),
    contramap((d: PublishedDeck) => d.repo.stargazers_count),
  );

export const byLatestRelease = (dir: SortDirection) =>
  F.pipe(
    dir(D.Ord),
    contramap((d: PublishedDeck) => new Date(d.release.published_at)),
  );

export const byCreationDate = (dir: SortDirection) =>
  F.pipe(
    dir(D.Ord),
    contramap((d: PublishedDeck) => new Date(d.repo.created_at)),
  );

export const byCards = (dir: SortDirection) =>
  F.pipe(
    dir(N.Ord),
    contramap((d: PublishedDeck) => d.deck.elements.length),
  );

// Cards
export const byComponents = (dir: SortDirection) =>
  F.pipe(
    dir(N.Ord),
    contramap((c: Element) => c.comps.length),
  );
