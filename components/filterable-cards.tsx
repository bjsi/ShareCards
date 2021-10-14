import {
  WithSearchFiltering,
  searchFilterCards,
} from "../components/search-filter";
import { WithPredicateFiltering } from "../components/predicate-filter";
import { WithSorting } from "../components/sort-filter";
import { CardsContainer } from "../components/cards-container";
import { byComponents } from "../utils/sorting";
import { hasImage, hasSound } from "../utils/filtering";

const sorters = [
  {
    name: "No. of components",
    sortBy: byComponents,
  },
];

const filters = [
  {
    name: "None",
    filterBy: _ => true,
  },
  {
    name: "Has image(s)",
    filterBy: hasImage,
  },
  {
    name: "Has sound(s)",
    filterBy: hasSound,
  },
];

export const FilterableTiledCards = WithSearchFiltering(
  searchFilterCards,
  WithPredicateFiltering(filters, WithSorting(sorters, CardsContainer)),
);
