import { debounce } from "ts-debounce";
import * as R from "react";
import * as F from "fp-ts/lib/function";
import * as B from "react-bootstrap";
import { PublishedDeck } from "../models/publishedDeck";
import { Element } from "../models/flashcards/cards";
import { HtmlComponentData } from "../models/flashcards/components";

interface ListDataFilterComponentProps<T> {
  data: T[];
}

export function WithSearchFiltering<T>(
  filter: (input: string, data: T[]) => T[],
  Child?: (props: { data: T[] }) => JSX.Element,
) {
  return function ({ data }: ListDataFilterComponentProps<T>) {
    const [input, setInput] = R.useState("");
    const handleInput = debounce(F.flow(setInput), 150);
    const filteredData = filter(input, data);
    return (
      <>
        <B.InputGroup className="m-1">
          <B.InputGroup.Text>Search:</B.InputGroup.Text>
          <B.Form.Control
            onChange={({ target: { value } }) => handleInput(value)}
            type="text"
          />
        </B.InputGroup>
        <Child data={filteredData} />
      </>
    );
  };
}

// Utilites
const matches = (searchTerm: string, target: string) =>
  target.toLowerCase().startsWith(searchTerm.toLowerCase());

export const searchFilterDecks = (input: string, decks: PublishedDeck[]) => {
  const inputMatches = (target: string) => matches(input, target);
  return decks.filter(deck => {
    return (
      inputMatches(deck.deck.title) ||
      inputMatches(deck.deck.author) ||
      inputMatches(deck.repo.description) ||
      deck.repo.topics.some(inputMatches)
    );
  });
};

export const searchFilterCards = (input: string, cards: Element[]) => {
  const inputMatches = (target: string): boolean => matches(input, target);
  return cards.filter(card =>
    card.comps
      .filter(comp => comp.type === "html")
      .some(comp => inputMatches((comp as HtmlComponentData).text)),
  );
};
