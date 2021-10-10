import * as t from "io-ts";
import * as D from "io-ts/Decoder";

export const githubUser = t.type({
  login: t.string,
  avatar_url: t.string,
  html_url: t.string,
})

export type GitHubUser = D.TypeOf<typeof githubUser>;
