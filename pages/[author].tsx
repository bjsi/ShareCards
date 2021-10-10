import * as O from "fp-ts/lib/Option";
import ErrorPage from "next/error";
import * as TE from "fp-ts/lib/TaskEither";
import { Footer } from "../components/footer";
import { Container } from "react-bootstrap";
import Meta from "../components/seo-meta";
import * as T from "fp-ts/lib/Task";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import * as F from "fp-ts/lib/function";
import { Deck } from "../models/deck";
import { getDeckByName, getAllDeckPaths, getDecksByAuthor } from "../lib/api";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps, GetStaticPaths } from "next";
import { log, warn } from "fp-ts/lib/Console";
import * as IO from "fp-ts/lib/IO";
import * as path from "path";
import { decksDir } from "../lib/filesystem";
import Link from "next/link";
import * as R from "fp-ts/lib/Record";
import { useEffect } from "react";
import { Layout } from "../components/layout";
import FlashcardDeck from "../components/deck";

interface AuthorPageProps {
  author: string;
  decks: Deck[];
}

interface Params extends ParsedUrlQuery {
  author: string;
}

export default function AuthorPage({ author, decks }: AuthorPageProps) {
  if (decks.length === 0) {
    return <ErrorPage statusCode={404} />;
  } else {
    const title = "Decks by " + decks[0].author;
    return (
      <Layout
        meta={
          <Meta
            title={title}
            desc={O.some("Flashcard decks created by " + author)}
            canonical="TODO"
          />
        }>
        <h1>{title}</h1>
        <ul>
          {decks.map(deck => (
            <FlashcardDeck deck={deck} key={`${deck.author} ${deck.title}`} />
          ))}
        </ul>
      </Layout>
    );
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return F.pipe(
    getAllDeckPaths,
    E.fold(
      e => {
        warn(e);
        return { paths: [], fallback: false };
      },
      F.flow(
        A.map(fp => path.relative(decksDir, fp).split("/")),
        A.map(split => ({ params: { author: split[0], deck: split[1] } })),
        params => ({ paths: params, fallback: false }),
      ),
    ),
  );
};

export const getStaticProps: GetStaticProps<AuthorPageProps, Params> =
  async context => {
    return await F.pipe(context?.params!, ({ author }) =>
      F.pipe(
        author,
        getDecksByAuthor,
        TE.fold(
          e => {
            warn(e);
            return T.of({ props: { decks: [], author } });
          },
          F.flow(
            T.map(R.separate),
            T.map(x => ({ props: { decks: Object.values(x.right), author } })),
          ),
        ),
      ),
    )();
  };
