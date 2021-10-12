import { Layout } from "../components/layout";
import Meta from "../components/seo-meta";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import { getAllPublisedDecks } from "../lib/api";
import { GetStaticProps } from "next";
import * as F from "fp-ts/lib/function";
import FlashcardDeck from "../components/deck";
import { PublishedDeck } from "../models/publishedDeck";
import Link from "next/link";
import { CardColumns } from "../components/card-column";
import { Container } from "react-bootstrap";

export interface HomeProps {
  decks: PublishedDeck[];
}

export default function Home({ decks }: HomeProps) {
  return (
    <Layout meta={<Meta title="Home" desc={O.none} canonical="TODO" />}>
      <p>
        <b>Share Cards</b> is a flashcard sharing website for{" "}
        <a href="https://www.supermemo.wiki/en/supermemo">SuperMemo</a> users.
        Share Cards is built entirely on top of GitHub, allowing{" "}
        <Link href="/authors">
          <a>deck authors</a>
        </Link>{" "}
        to effortlessly share their masterpieces with the community through
        GitHub repositories. Commenting, liking, voting and downloading is all
        implemented through GitHub, so even if Share Cards dies, deck owners'
        data, comments and stars will live on!
      </p>

      <h2>Top Decks</h2>

      <p>Browse some of the community's most popular decks:</p>

      {decks.length === 0 ? (
        <p>No decks available. Check back later!</p>
      ) : (
        <CardColumns>
          {decks.map(deck => (
            <FlashcardDeck
              key={`${deck.deck.title} ${deck.repo.owner.login}`}
              deck={deck}
            />
          ))}
        </CardColumns>
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return await F.pipe(
    getAllPublisedDecks(),
    T.map(results => ({ props: { decks: results } })),
  )();
};
