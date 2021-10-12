import { Layout } from "../components/layout";
import Meta from "../components/seo-meta";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import { getAllPublisedDecks } from "../lib/api";
import { GetStaticProps } from "next";
import * as F from "fp-ts/lib/function";
import FlashcardDeck from "../components/deck";
import { PublishedDeck } from "../models/publishedDeck";
import { CardColumns } from "../components/card-column";
import { Button, Card, ListGroup, Image, Form, Badge } from "react-bootstrap";
import { GitHubComments } from "../components/github-comments";
import * as R from "react";
import { debounce } from "ts-debounce";
import { Deck } from "../models/flashcards/deck";
import Link from "next/link";

export interface HomeProps {
  decks: PublishedDeck[];
}

function uniqueByKey<T, A>(list: T[], getter: (item: T) => A) {
  const set = new Set<A>();
  return list.filter(x => !set.has(getter(x)));
}

interface SearchFilterContainerProps<T> {
  data: T[];
}

interface ToggleButtonFilterProps<T> {
  data: T[];
}

interface ToggleFilterButtonProps {
  text: string;
  setActiveToggles: R.Dispatch<R.SetStateAction<Set<string>>>;
  activeToggles: Set<string>;
  updateData: () => void;
}

function ToggleFilterButton({
  text,
  updateData,
  setActiveToggles,
  activeToggles,
}: ToggleFilterButtonProps) {
  const handleClick = () => {
    setActiveToggles(last =>
      last.has(text)
        ? new Set([...last].filter(x => x !== text))
        : new Set([...last, text]),
    );
    updateData();
  };
  return (
    <Button
      onClick={() => handleClick()}
      className="btn-sm"
      variant={`${activeToggles.has(text) ? "" : "outline-"}primary`}>
      {text}
    </Button>
  );
}

function WithToggleButtonFiltering<T>(
  getToggles: (data: T[]) => Set<string>,
  predicate: (toggles: Set<string>, data: T) => boolean,
  Child?: (props: { data: T[] }) => JSX.Element,
) {
  return function ({ data }: ToggleButtonFilterProps<T>) {
    const toggles = getToggles(data);
    const [activeToggles, setActiveToggles] = R.useState(toggles);
    const [filteredData, setFilteredData] = R.useState(
      data.filter(x => predicate(activeToggles, x)),
    );

    const updateData = () => {
      setFilteredData(_ => {
        const n = data.filter(x => predicate(activeToggles, x));
        console.log(n);
        return n;
      });
    };

    return (
      <>
        {Array.from(toggles).map(toggle => (
          <ToggleFilterButton
            setActiveToggles={setActiveToggles}
            activeToggles={activeToggles}
            updateData={updateData}
            text={toggle}
            key={toggle}
          />
        ))}
        <Child data={filteredData} />
      </>
    );
  };
}

function WithSearchFiltering<T>(
  filter: (input: string, data: T[]) => T[],
  Child?: (props: { data: T[] }) => JSX.Element,
) {
  return function ({ data }: SearchFilterContainerProps<T>) {
    const [filteredData, setFilteredData] = R.useState<T[]>(data);
    const handleInput = debounce(F.flow(filter, setFilteredData), 150);
    return (
      <>
        <Form.Control
          onChange={({ target: { value } }) => handleInput(value, data)}
          type="text"
          placeholder="Search..."
        />
        <Child data={filteredData} />
      </>
    );
  };
}

const CardsContainer = ({ data }: { data: PublishedDeck[] }) => {
  return (
    <CardColumns>
      {data.map(deck => (
        <FlashcardDeck
          key={`${deck.deck.title} ${deck.repo.owner.login}`}
          deck={deck}
        />
      ))}
    </CardColumns>
  );
};

const searchFilterDecks = (input: string, decks: PublishedDeck[]) => {
  const matches = (prop: string) =>
    prop.toLowerCase().startsWith(input.toLowerCase());
  return decks.filter(deck => {
    return (
      matches(deck.deck.title) ||
      matches(deck.deck.author) ||
      matches(deck.repo.description) ||
      deck.repo.topics.some(matches)
    );
  });
};

const toggleFilterDecks = (toggles: Set<String>, deck: PublishedDeck) => {
  return deck.repo.topics.some(topic => toggles.has(topic));
};

const getAllTopics = (decks: PublishedDeck[]) =>
  decks.reduce(
    (acc, deck) => (acc = new Set<string>([...acc, ...deck.repo.topics])),
    new Set<string>(),
  );

const FilterableCardCols = WithToggleButtonFiltering(
  getAllTopics,
  toggleFilterDecks,
  WithSearchFiltering(searchFilterDecks, CardsContainer),
);

export default function Home({ decks }: HomeProps) {
  const authors = decks.map(deck => ({
    ...deck.repo.owner,
    name: deck.deck.author,
  }));
  const uniqueAuthors = uniqueByKey(authors, a => a.login);

  return (
    <Layout meta={<Meta title="Home" desc={O.none} canonical="TODO" />}>
      <p>
        <b>Share Cards</b> is a flashcard sharing website for SuperMemo users.
        Share Cards is built entirely on top of GitHub, allowing deck authors to
        effortlessly share their masterpieces with the community through GitHub
        repositories. Commenting, liking, voting and downloading is all
        implemented through GitHub, so even if Share Cards dies, deck owners'
        data, comments and stars will live on!
      </p>

      <h2>Contributors</h2>
      <p>
        Since Share Cards has been running, {uniqueAuthors.length} people have
        shared decks. If you are interested in sharing a deck, check out the{" "}
        <Link href="/guide">
          <a>deck authoring guide</a>
        </Link>
        .
      </p>
      <Card>
        <ListGroup horizontal>
          {uniqueAuthors.map((author, idx) => (
            <ListGroup.Item style={{ justifyContent: "center" }} key={idx}>
              <Image
                className="m-2"
                width="45px"
                height="45px"
                roundedCircle
                src={author.avatar_url}
              />
              <small>{author.name}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <h2>Decks</h2>
      <p>Browse some of the community's most popular decks...</p>

      {decks.length === 0 ? (
        <p>No decks available. Check back later!</p>
      ) : (
        <FilterableCardCols data={decks} />
      )}

      <hr />
      <GitHubComments username={"bjsi"} repo={"ShareCards"}>
        <p>
          Share Cards is a work in progress. If there are any features you want
          to see or if you encounter any bugs, don't hesitate to leave a
          comment.
        </p>
      </GitHubComments>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return await F.pipe(
    getAllPublisedDecks(),
    T.map(results => ({ props: { decks: results } })),
  )();
};
