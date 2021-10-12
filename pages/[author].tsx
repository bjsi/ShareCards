import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import ErrorPage from "next/error";
import Meta from "../components/seo-meta";
import * as T from "fp-ts/lib/Task";
import * as F from "fp-ts/lib/function";
import {
  getPublishedDecksByAuthor,
  getPublishedFilePathSegments,
} from "../lib/api";
import { ParsedUrlQuery } from "querystring";
import { GetStaticPaths, GetStaticProps } from "next";
import { Layout } from "../components/layout";
import FlashcardDeck from "../components/deck";
import { PublishedDeck } from "../models/publishedDeck";
import { decksBaseDir } from "../lib/filesystem";
import { CardColumns } from "../components/card-column";

interface AuthorPageProps {
  author: string;
  decks: PublishedDeck[];
}

interface Params extends ParsedUrlQuery {
  author: string;
}

export default function AuthorPage({ author, decks }: AuthorPageProps) {
  if (decks.length === 0) {
    return <ErrorPage statusCode={404} />;
  } else {
    const name = decks[0].deck.author;
    const title = "Decks by " + name;
    const totalStars = decks.reduce(
      (acc, x) => x.repo.stargazers_count + acc,
      0,
    );
    return (
      <Layout
        meta={
          <Meta
            title={title}
            desc={O.some("Flashcard decks created by " + name)}
            canonical="TODO"
          />
        }>
        <h1>{title}</h1>
        <p>
          {name} has shared {decks.length}{" "}
          {`deck${decks.length === 1 ? "" : "s"}`} with {totalStars}{" "}
          {`star${totalStars === 1 ? "" : "s"}`}.
        </p>
        <CardColumns>
          {decks.map(deck => (
            <FlashcardDeck deck={deck} key={`${author} ${deck.repo.name}`} />
          ))}
        </CardColumns>
      </Layout>
    );
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return F.pipe(
    getPublishedFilePathSegments(decksBaseDir),
    A.map(({ author }) => ({ params: { author } })),
    params => ({ paths: params, fallback: false }),
  );
};

export const getStaticProps: GetStaticProps<AuthorPageProps, Params> =
  async context => {
    return await F.pipe(context?.params!, ({ author }) =>
      F.pipe(
        getPublishedDecksByAuthor(author),
        T.map(decks => ({ props: { decks, author } })),
      ),
    )();
  };
