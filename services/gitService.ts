import axios, { AxiosResponse } from 'axios';
import { failure } from 'io-ts/lib/PathReporter'
import {Issue, issues} from '../models/issue';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as F from 'fp-ts/lib/function';
import * as t from 'io-ts';

const gitClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

const get = (url: string): TE.TaskEither<Error, AxiosResponse> => {
  return TE.tryCatch<Error, AxiosResponse>(
    () => gitClient.get(url, { headers: { Accept: 'application/vnd.github.squirrel-girl-preview' }}),
    reason => new Error(String(reason))
  );
}

const decodeWith = <A>(decoder: t.Decoder<unknown, A>) =>
  F.flow(
    decoder.decode,
    E.mapLeft(errors => new Error(failure(errors).join('\n'))),
    TE.fromEither
  )

// const post = <T>()

export const getIssues = (user: string, repo: string): TE.TaskEither<Error, Issue[]> => {
  return F.pipe(
    get(`/repos/${user}/${repo}/issues`),
    TE.map(resp => resp.data),
    TE.chain(decodeWith(issues))
  );
};
