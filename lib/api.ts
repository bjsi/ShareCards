import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";
import * as AP from "fp-ts/lib/Apply";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { deckData } from "../models/flashcards/deck";
import * as path from "path";
import * as TE from "fp-ts/lib/TaskEither";
import {
  communityDeckList,
  fullRepoDataPath,
  fullDeckDataPath,
  fullReleaseDataPath,
  decksBaseDir,
  deckFileName,
  readFile,
  fullAuthorBasePath,
} from "./filesystem";
import { toError } from "fp-ts/lib/Either";
import * as F from "fp-ts/lib/function";
import * as t from "io-ts";
import readdirRecursive from "fs-readdir-recursive";
import { PublishedDeck } from "../models/publishedDeck";
import { releaseData } from "../models/git/release";
import { repoData } from "../models/git/repo";
import { decodeWith } from "../utils/decoding";
import { parseJSON } from "./json";
import { log } from "fp-ts/lib/Console";

export interface DeckPathSegment {
  author: string;
  deck: string;
}

/**
 * @returns a Task to get a list of DeckPathSegments.
 */
export const getCommunityDeckListPathSegments = (): T.Task<
  DeckPathSegment[]
> => {
  return F.pipe(
    readAndDecodeJson(communityDeckList, t.array(t.string)),
    TE.fold(
      err => {
        console.log(err);
        return T.of([]);
      },
      decks =>
        F.pipe(
          decks,
          A.map(x => x.split("/")),
          A.map(([author, deck]) => ({ author, deck })),
          segments => T.of(segments),
        ),
    ),
  );
};

/**
 * Recursively gets a list of DeckPathSegments starting from `{@startingDir}`.
 */
export const getPublishedFilePathSegments = (
  startingDir: string,
): DeckPathSegment[] => {
  return F.pipe(
    E.tryCatch(() => readdirRecursive(startingDir), toError),
    E.fold(
      err => {
        console.log(err);
        return [];
      },
      F.flow(
        A.filter(file => path.basename(file) === deckFileName),
        A.map(file => path.join(startingDir, file)),
        A.map(file => path.relative(decksBaseDir, file)),
        A.map(file => file.split("/")),
        A.map(([author, deck]) => ({ author, deck })),
      ),
    ),
  );
};

const readPublishedDeck = ({
  author,
  deck,
}: DeckPathSegment): TE.TaskEither<Error, PublishedDeck> => {
  return F.pipe(
    {
      repo: readAndDecodeJson(fullRepoDataPath(author, deck), repoData),
      deck: readAndDecodeJson(fullDeckDataPath(author, deck), deckData),
      release: readAndDecodeJson(
        fullReleaseDataPath(author, deck),
        releaseData,
      ),
    },
    AP.sequenceS(TE.ApplyPar),
  );
};

/**
 * Reads and decodes the repo, deck and release json files for a particular
 * published deck in parallel and @returns an instance of PublishedDeck or an error if
 * there was an issue reading any of the files.
 */
export const getPublishedDeckByName = (
  segments: DeckPathSegment,
): T.Task<O.Option<PublishedDeck>> => {
  return F.pipe(
    readPublishedDeck(segments),
    TE.fold(
      e => {
        console.log(e);
        return T.of(O.none);
      },
      deck => T.of(O.some(deck)),
    ),
  );
};

const readPublishedDecks = (
  segments: DeckPathSegment[],
): T.Task<PublishedDeck[]> => {
  return F.pipe(
    segments,
    A.traverse(T.task)(readPublishedDeck),
    T.map(A.separate),
    T.chainFirstIOK(x => log(x.left)),
    T.map(x => x.right),
  );
};

/**
 * Gets all available published decks in parallel. Any IO error or attempt to decode
 * an invalid deck will be logged and the deck in question will be excluded from the final list.
 */
export const getAllPublisedDecks = (): T.Task<PublishedDeck[]> => {
  return F.pipe(
    getPublishedFilePathSegments(decksBaseDir),
    readPublishedDecks,
    T.chainFirstIOK(log),
  );
};

/**
 * Gets all available published decks by an author in parallel. Any IO error or attempt to decode
 * an invalid deck will be logged and the deck in question will be excluded from the final list.
 */
export const getPublishedDecksByAuthor = (
  author: string,
): T.Task<PublishedDeck[]> => {
  return F.pipe(
    getPublishedFilePathSegments(fullAuthorBasePath(author)),
    readPublishedDecks,
  );
};

const readAndDecodeJson = <A>(path: string, decoder: t.Decoder<unknown, A>) =>
  F.pipe(
    readFile(path),
    TE.chain(F.flow(parseJSON, TE.fromEither, TE.chain(decodeWith(decoder)))),
  );
