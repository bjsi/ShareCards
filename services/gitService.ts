import axios, { AxiosResponse } from "axios";
import { Issue, issues } from "../models/git/issue";
import * as TE from "fp-ts/lib/TaskEither";
import * as F from "fp-ts/lib/function";
import { Repo, repoData } from "../models/git/repo";
import { Release, releaseData } from "../models/git/release";
import { deckData, Deck } from "../models/flashcards/deck";
import { decodeWith } from "../utils/decoding";

const gitClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
});

const get = (url: string): TE.TaskEither<Error, AxiosResponse> => {
  return TE.tryCatch<Error, AxiosResponse>(
    () =>
      gitClient.get(url, {
        headers: { Accept: "application/vnd.github.squirrel-girl-preview" },
      }),
    reason => new Error(String(reason)),
  );
};

export const getIssues = (
  user: string,
  repo: string,
): TE.TaskEither<Error, Issue[]> => {
  return F.pipe(
    get(`/repos/${user}/${repo}/issues`),
    TE.map(resp => resp.data),
    TE.chain(decodeWith(issues)),
  );
};

export const getRepo = (
  user: string,
  repository: string,
): TE.TaskEither<Error, Repo> => {
  return F.pipe(
    get(`/repos/${user}/${repository}`),
    TE.map(resp => resp.data),
    TE.chain(decodeWith(repoData)),
  );
};

export const getLatestRelease = (
  user: string,
  repo: string,
): TE.TaskEither<Error, Release> => {
  return F.pipe(
    get(`/repos/${user}/${repo}/releases/latest`),
    TE.map(resp => resp.data),
    TE.chain(decodeWith(releaseData)),
  );
};

export const downloadLatestRelease = (
  url: string,
): TE.TaskEither<Error, Deck> => {
  return F.pipe(
    TE.tryCatch<Error, AxiosResponse>(
      () => axios({ url: url, method: "GET" }),
      reason => new Error(String(reason)),
    ),
    TE.map(resp => resp.data),
    TE.chain(decodeWith(deckData)),
  );
};
