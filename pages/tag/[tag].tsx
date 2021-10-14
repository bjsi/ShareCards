import * as A from "fp-ts/lib/Array";
import Meta from "../../components/seo-meta";
import * as T from "fp-ts/lib/Task";
import * as F from "fp-ts/lib/function";
import { getAllPublishedDecks } from "../../lib/api";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps, GetStaticPaths } from "next";
import { Layout } from "../../components/layout";
import { PublishedDeck } from "../../models/publishedDeck";
import { FilterableTiledDecks } from "../../components/filterable-decks";
import * as O from "fp-ts/lib/Option";

interface TagPageProps {
  decks: PublishedDeck[];
  tag: string;
}

interface Params extends ParsedUrlQuery {
  tag: string;
}

export default function Tag({ decks, tag }: TagPageProps) {
  return (
    <Layout
      meta={
        <Meta
          title={`Decks with tag '${tag}'`}
          desc={O.none}
          canonical="TODO"
        />
      }>
      <h1>Decks tagged with "{tag}"</h1>
      <FilterableTiledDecks data={decks} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return await F.pipe(
    getAllPublishedDecks(),
    T.map(
      F.flow(
        A.map(deck => deck.repo.topics),
        A.flatten,
        A.map(tag => ({ params: { tag } })),
      ),
    ),
    T.map(paths => ({ paths, fallback: false })),
  )();
};

export const getStaticProps: GetStaticProps<TagPageProps, Params> =
  async context => {
    return await F.pipe(context?.params!, ({ tag }) =>
      F.pipe(
        getAllPublishedDecks(),
        T.map(A.filter(deck => deck.repo.topics.some(topic => topic === tag))),
        T.map(decks => ({ props: { decks, tag } })),
      ),
    )();
  };
