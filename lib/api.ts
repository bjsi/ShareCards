import { promises as fs } from "fs";
import * as J from "fp-ts/Json";
import * as T from "fp-ts/lib/Task";
import * as AP from "fp-ts/lib/Apply";
import * as semigroup from "fp-ts/lib/Semigroup";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { Deck, deck } from "../models/deck";
import * as path from "path";
import * as TE from "fp-ts/lib/TaskEither";
import { decksDir } from "./filesystem";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import * as F from "fp-ts/lib/function";
import * as R from "fp-ts/lib/Record";
import * as O from "fp-ts/lib/Option";
import * as t from "io-ts";
import readdirRecursive from "fs-readdir-recursive";
import { log } from "fp-ts/lib/Console";

// const search: (
//   pattern: string,
//   options: glob.IOptions
// ) => TE.TaskEither<Error, ReadonlyArray<string>> = TE.taskify<string, glob.IOptions, Error, ReadonlyArray<string>>(glob)

const readFile = (file: string): TaskEither<Error, string> => {
  return tryCatch(() => fs.readFile(file, { encoding: "utf-8" }), toError);
};

const readDir = (dir: string): TaskEither<Error, string[]> => {
  return tryCatch(() => fs.readdir(dir), toError);
};

const writeFile = (file: string, content: string): TaskEither<Error, void> => {
  return tryCatch(
    () => fs.writeFile(file, content, { encoding: "utf8" }),
    toError,
  );
};

export const getDeckByName = (author: string, name: string) => {
  return F.pipe(path.join(decksDir, author, name + ".json"), readDeck);
};

export const getDeckPathsByAuthor = (author: string) => {
  return F.pipe(
    path.join(decksDir, author),
    readDir,
    TE.map(A.map(deck => path.join(decksDir, author, deck))),
  );
};

export const getDecksByAuthor = (author: string) => {
  return F.pipe(getDeckPathsByAuthor(author), TE.map(readDecks));
};

const parseJSON = F.flow(
  J.parse,
  E.mapLeft(e => (e instanceof Error ? e : new Error("Failed to parse JSON."))),
);

const parseIntoDeck = F.flow(parseJSON, E.chainW(deck.decode));

const createDeckReadTaskMap = (decks: string[]) => {
  return R.fromFoldableMap(
    semigroup.last<TaskEither<Error | t.Errors, Deck>>(),
    A.Foldable,
  )(decks, deck => [deck, readDeck(deck)]);
};

export const getAllDeckPaths = F.pipe(
  E.tryCatch(() => readdirRecursive(decksDir), toError),
  E.map(
    F.flow(
      A.filter(d => path.extname(d) === ".json"),
      A.map(d => path.join(decksDir, d)),
    ),
  ),
);

const readDecks = (paths: string[]) =>
  F.pipe(createDeckReadTaskMap(paths), AP.sequenceS(T.ApplyPar));

const readDeck = (path: string) =>
  F.pipe(readFile(path), TE.chain(F.flow(parseIntoDeck, TE.fromEither)));

export const getAllDecks = F.pipe(
  getAllDeckPaths,
  TE.fromEither,
  TE.map(readDecks),
);
