import * as t from 'io-ts';
import * as D from "io-ts/Decoder";
import {reactions} from './reaction';
import {githubUser} from './user';

// export const label = t.type({

// });

export const issue = t.type({
  html_url: t.string,
  comments_url: t.string,
  number: t.number,
  title: t.string,
  state: t.string,
  created_at: t.string,
  comments: t.number,
  body: t.string,
  reactions: reactions,
  user: githubUser,
  //labels: t.array(label),
  //reactions
});

export const issues = t.array(issue);
export type Issue = D.TypeOf<typeof issue>;
