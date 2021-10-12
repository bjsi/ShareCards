import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { githubUser } from "./user";

export const repoData = t.type({
  name: t.string,
  stargazers_count: t.number,
  owner: githubUser,
  description: t.string,
  created_at: t.string,
  topics: t.array(t.string),
});

export type Repo = D.TypeOf<typeof repoData>;
