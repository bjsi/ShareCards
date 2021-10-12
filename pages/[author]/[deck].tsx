import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import ErrorPage from "next/error";
import * as TE from "fp-ts/lib/TaskEither";
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
import * as path from "path";
import Flashcard from "../../components/card";
import {
  downloadLatestRelease,
  getLatestRelease,
  getRepo,
} from "../../services/gitService";
import { Layout } from "../../components/layout";
import { getCommunityDeckListPathSegments } from "../../lib/api";
import { GitHubComments } from "../../components/github-comments";
import { log } from "fp-ts/lib/Console";
import {
  decksBaseDir,
  fullDeckDataPath,
  fullReleaseDataPath,
  fullRepoDataPath,
  writeFile,
} from "../../lib/filesystem";
import { PublishedDeck } from "../../models/publishedDeck";
import { jsonify } from "../../lib/json";
import { Repo } from "../../models/git/repo";
import { Release } from "../../models/git/release";
import { Deck } from "../../models/flashcards/deck";
import { CardColumns } from "../../components/card-column";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FA from "@fortawesome/free-solid-svg-icons";

interface DeckPageProps {
  Odeck: O.Option<PublishedDeck>;
}

interface Params extends DeckPathSegment, ParsedUrlQuery {}

export default function DeckPage({ Odeck }: DeckPageProps) {
  if (O.isNone(Odeck)) {
    return <ErrorPage statusCode={404} />;
  } else {
    const deck = Odeck.value;
    const cards = deck.deck.elements;
    const desc = deck.repo.description;
    const repo = deck.repo;
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
          {desc.length === 0 ? "No description available for this deck." : desc}
        </div>
        <span>
          <Link
            href={`https://github.com/${deck.repo.owner.login}/${deck.repo.name}/releases/latest`}>
            <Button variant="outline-primary">
              <FontAwesomeIcon icon={FA.faDownload} /> Download
            </Button>
          </Link>
        </span>{" "}
        <span>
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={FA.faStar} />
          </Button>
        </span>
        <hr />
        <h2>Cards</h2>
        <CardColumns>
          {cards.map((card, idx) => (
            <Flashcard key={idx} isPreview={false} data={card} />
          ))}
        </CardColumns>
        <hr />
        <GitHubComments username={repo.owner.login} repo={repo.name} />
      </Layout>
    );
  }
}

const writeJson = (fp: string, obj: any) => {
  return F.pipe(
    jsonify(obj),
    TE.fromEither,
    TE.chain(json => writeFile(fp, json)),
  );
};

// TODO: need to make sure directory is created.
const writeRepo = (repo: Repo) => {
  const fp = path.join(fullRepoDataPath(repo.owner.login, repo.name));
  return writeJson(fp, repo);
};

const writeReleaseInfo = (release: Release, user: string, repo: string) => {
  const fp = path.join(fullReleaseDataPath(user, repo));
  return writeJson(fp, release);
};

const writeLatestDeck = (deck: Deck, user: string, repo: string) => {
  const fp = path.join(fullDeckDataPath(user, repo));
  return writeJson(fp, deck);
};

const updateRepoInfo = async ({ author, deck }: DeckPathSegment) => {
  console.log("Getting the latest repo info.");
  await F.pipe(
    getRepo(author, deck),
    T.chainFirstIOK(log),
    TE.chain(writeRepo),
  )();

  console.log("Getting the latest release info.");
  const maybeLatestRelease = await getLatestRelease(author, deck)();
  if (E.isLeft(maybeLatestRelease)) {
    console.log(maybeLatestRelease.left);
    return;
  } else {
    const release = maybeLatestRelease.right;
    const assets = release.assets;
    const deckAsset = assets.filter(asset => asset.name === "deck.json")[0];
    if (!deckAsset) {
      console.log("Release contains no deck.json asset.");
      return;
    }

    const maybeDeck = await downloadLatestRelease(
      deckAsset.browser_download_url,
    )();
    if (E.isLeft(maybeDeck)) {
      console.log(maybeDeck.left);
      return;
    } else {
      console.log("Writing latest release info");
      const deckdata = maybeDeck.right;
      await Promise.all([
        writeReleaseInfo(release, author, deck)(),
        writeLatestDeck(deckdata, author, deck),
      ]);
    }
  }
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  // TODO: move into a prebuild, predev script?
  await F.pipe(
    getCommunityDeckListPathSegments(),
    T.map(A.traverse(T.task)(segments => T.of(updateRepoInfo(segments)))),
  )();

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
      T.map(Odeck => ({ props: { Odeck } })),
    )();
  };
