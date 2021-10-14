import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as path from "path";
import { promises as fs } from "fs";
import * as fsSync from "fs";
import * as F from "fp-ts/lib/function";
import { jsonify } from "./json";

export const applicationBaseDir = process.cwd();
export const decksBaseDir = path.join(applicationBaseDir, "_decks");
export const postsBaseDir = path.join(applicationBaseDir, "_posts");
export const communityDeckList = path.join(
  applicationBaseDir,
  "community-decks.json",
);

export const repoFileName = "repo.json";
export const deckFileName = "deck.json";
export const releaseFileName = "release.json";

export const fullPostPath = (post: string) => path.join(postsBaseDir, post);
export const fullDeckBasePath = (author: string, repo: string) =>
  path.join(decksBaseDir, author, repo);
export const fullAuthorBasePath = (author: string) =>
  path.join(decksBaseDir, author);
export const fullRepoDataPath = (author: string, repo: string) =>
  path.join(fullDeckBasePath(author, repo), repoFileName);
export const fullDeckDataPath = (author: string, repo: string) =>
  path.join(fullDeckBasePath(author, repo), deckFileName);
export const fullReleaseDataPath = (author: string, repo: string) =>
  path.join(fullDeckBasePath(author, repo), releaseFileName);

export const readFile = (file: string): TE.TaskEither<Error, string> => {
  return TE.tryCatch(() => fs.readFile(file, { encoding: "utf-8" }), E.toError);
};

export const readDir = (dir: string): TE.TaskEither<Error, string[]> => {
  return TE.tryCatch(() => fs.readdir(dir), E.toError);
};

export const makeDir = (dir: string): TE.TaskEither<Error, void> => {
  return TE.tryCatch(() => fs.mkdir(dir, { recursive: true }), E.toError);
};

export const writeFile = (
  file: string,
  content: string,
): TE.TaskEither<Error, void> => {
  return TE.tryCatch(
    () => fs.writeFile(file, content, { encoding: "utf8" }),
    E.toError,
  );
};

export const writeJson = (fp: string, obj: any) => {
  return F.pipe(
    jsonify(obj),
    TE.fromEither,
    TE.chain(json => writeFile(fp, json)),
  );
};
