import {WithToggleButtonFiltering, toggleFilterDecks} from '../components/toggle-filter';
import {WithSearchFiltering, searchFilterDecks} from '../components/search-filter';
import {DecksContainer} from '../components/decks-container';
import { PublishedDeck } from '../models/publishedDeck';

const getUniqueTags = (decks: PublishedDeck[]) =>
  decks.reduce(
    (acc, deck) => (acc = new Set<string>([...acc, ...deck.repo.topics])),
    new Set<string>(),
  );

export const FilterableTiledDecks = WithToggleButtonFiltering(
  getUniqueTags,
  toggleFilterDecks,
  WithSearchFiltering(searchFilterDecks, DecksContainer),
);
