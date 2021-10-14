import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import ErrorPage from "next/error";
import Meta from "../../components/seo-meta";
import * as T from "fp-ts/lib/Task";
import * as F from "fp-ts/lib/function";
import {
  DeckPathSegment,
  getPublishedFilePathSegments,
  getPublishedDeckByName,
} from "../../lib/api";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps, GetStaticPaths } from "next";
import Flashcard from "../../components/card";
import { Layout } from "../../components/layout";
import { GitHubComments } from "../../components/github-comments";
import { decksBaseDir } from "../../lib/filesystem";
import { PublishedDeck } from "../../models/publishedDeck";
import { CardColumns } from "../../components/card-column";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FA from "@fortawesome/free-solid-svg-icons";
import { humanRelativeDate } from "../../utils/dates";
import { FilterableTiledCards } from "../../components/filterable-cards";

interface DeckPageProps {
  mdeck: O.Option<PublishedDeck>;
}

interface Params extends DeckPathSegment, ParsedUrlQuery {}

export default function DeckPage({ mdeck }: DeckPageProps) {
  if (O.isNone(mdeck)) {
    return <ErrorPage statusCode={404} />;
  } else {
    const deck = mdeck.value;
    const cards = deck.deck.elements;
    const desc = deck.repo.description;
    const repo = deck.repo;
    const release = deck.release;
    return (
      <Layout
        meta={<Meta title={deck.deck.title} desc={O.none} canonical="TODO" />}>
        <h1>{deck.deck.title}</h1>
        <div>
          <FontAwesomeIcon size="sm" icon={FA.faUser} /> {deck.deck.author}
        </div>
        <div>
          <FontAwesomeIcon size="sm" icon={FA.faStickyNote} />{" "}
          {`${cards.length} card${cards.length === 1 ? "" : "s"}`}
        </div>
        <div>
          <FontAwesomeIcon size="sm" icon={FA.faCalendar} /> Last release{" "}
          {humanRelativeDate(release.published_at)}
        </div>
        <div>
          {desc.length === 0 ? "No description available for this deck." : desc}
        </div>
        <span>
          <Link
            href={`https://github.com/${deck.repo.owner.login}/${deck.repo.name}/releases/latest`}>
            <Button className="btn-sm" variant="outline-primary">
              <FontAwesomeIcon icon={FA.faDownload} /> Download
            </Button>
          </Link>
        </span>{" "}
        <span>
          <Button className="btn-sm" variant="outline-primary">
            <FontAwesomeIcon icon={FA.faStar} />
          </Button>
        </span>
        <hr />
        <h2>Cards</h2>
        <FilterableTiledCards data={cards} />
        <hr />
        <GitHubComments username={repo.owner.login} repo={repo.name} />
      </Layout>
    );
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return F.pipe(
    getPublishedFilePathSegments(decksBaseDir),
    A.map(({ author, deck }) => ({ params: { author, deck } })),
    paths => ({ paths, fallback: false }),
  );
};

export const getStaticProps: GetStaticProps<DeckPageProps, Params> =
  async context => {
    return await F.pipe(
      context?.params!,
      segments => getPublishedDeckByName(segments),
      T.map(mdeck => ({ props: { mdeck } })),
    )();
  };
