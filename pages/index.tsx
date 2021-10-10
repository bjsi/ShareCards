import { Footer } from "../components/footer";
import { Layout } from "../components/layout";
import Meta from "../components/seo-meta";
import * as A from "fp-ts/lib/Array";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import { getAllDecks } from "../lib/api";
import { pipe } from "fp-ts/lib/function";
import { Deck } from "../models/deck";
import { Container } from "react-bootstrap";
import { GetStaticProps } from "next";
import { warn } from "console";
import * as F from "fp-ts/lib/function";
import * as R from "fp-ts/lib/Record";
import { log } from "fp-ts/lib/Console";
import { failure } from "io-ts/lib/PathReporter";
import FlashcardDeck from "../components/deck";

export interface HomeProps {
  decks: Deck[];
}

export default function Home({ decks }: HomeProps) {
  return (
    <Layout meta={<Meta title="Home" desc={O.none} canonical="TODO" />}>
        <p>Share Cards is a flashcard sharing website for SuperMemo users.</p>
        {
          decks.length === 0 
            ? <p>No decks available. Check back later!</p>
            : decks.map(deck => <FlashcardDeck key={`${deck.title} ${deck.author}`} deck={deck}/>)
        }
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return await pipe(
    getAllDecks,
    TE.fold(
      e => {
        warn(e);
        return T.of({ props: { decks: [] } });
      },
      F.flow(
        T.map(R.separate),
        T.chainFirstIOK(r =>
          pipe(
            Object.values(r.left),
            A.map(e => (e instanceof Error ? log(e) : log(failure(e)))),
            x => x[0],
          ),
        ),
        T.map(results => ({ props: { decks: Object.values(results.right) } })),
      ),
    ),
  )();
};
