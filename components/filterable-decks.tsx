import {
  WithToggleButtonFiltering,
  toggleFilterDecks,
} from "../components/toggle-filter";
import {
  WithSearchFiltering,
  searchFilterDecks,
} from "../components/search-filter";
import { WithSorting } from "../components/sort-filter";
import { DecksContainer } from "../components/decks-container";
import { PublishedDeck } from "../models/publishedDeck";
import {
  byCards,
  byCreationDate,
  byLatestRelease,
  byStars,
} from "../utils/sorting";

const getUniqueTags = (decks: PublishedDeck[]) =>
  decks.reduce(
    (acc, deck) => (acc = new Set<string>([...acc, ...deck.repo.topics])),
    new Set<string>(),
  );

const sorters = [
  {
    name: "No. of stars",
    sortBy: byStars,
  },
  {
    name: "Latest release",
    sortBy: byLatestRelease,
  },
  {
    name: "Creation date",
    sortBy: byCreationDate,
  },
  {
    name: "No. of cards",
    sortBy: byCards,
  },
];

export const FilterableTiledDecks = WithToggleButtonFiltering(
  getUniqueTags,
  toggleFilterDecks,
  WithSearchFiltering(searchFilterDecks, WithSorting(sorters, DecksContainer)),
);
