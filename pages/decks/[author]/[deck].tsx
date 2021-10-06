import * as O from "fp-ts/lib/Option";
import ErrorPage from "next/error";
import * as TE from "fp-ts/lib/TaskEither";
import { Footer } from "../../../components/footer";
import { Container } from "react-bootstrap";
import Meta from "../../../components/seo-meta";
import * as T from "fp-ts/lib/Task";
import * as F from "fp-ts/lib/function";
import { Deck } from "../../../models/deck";
import { getDeckByName } from "../../../lib/api";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps, GetStaticPaths } from "next";
import { warn } from "fp-ts/lib/Console";

interface DeckPageProps {
  maybeDeck: O.Option<Deck>;
}

interface Params extends ParsedUrlQuery {
  author: string;
  deck: string;
}

export default function DeckPage({ maybeDeck }: DeckPageProps) {
  if (O.isNone(maybeDeck)) {
    return <ErrorPage statusCode={404} />;
  } else {
    const deck = maybeDeck.value;
    return (
      <div>
        <Meta title={deck.title} desc={O.none} canonical="TODO" />
        <Container>
          <h1>{deck.title}</h1>
          <p>
            {O.getOrElse(() => "No description available for this deck.")(
              deck.description,
            )}
          </p>
        </Container>
        <Footer />
      </div>
    );
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  // return F.pipe(
  // 	getAllDeckPaths,
  // 	E.fold(
  // 	  e => { warn(e); return {paths: [], fallback: false}},
  // F.flow(
  // 		A.map(rel => ({params: {slug: path.relative(rel, decksDir).replace(/\.json/, '')}})),
  // 		paramObjs => ({paths: paramObjs, fallback: false})
  // 	)),
  // )
  return {
    paths: [{ params: { author: "bjsi", deck: "test" } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DeckPageProps, Params> =
  async context => {
    return await F.pipe(
      context?.params!,
      ({ author, deck }) => getDeckByName(author, deck),
      TE.fold(
        e => {
          warn(e);
          return T.of({ props: { maybeDeck: O.none } });
        },
        deck => T.of({ props: { maybeDeck: O.some(deck) } }),
      ),
    )();
  };
