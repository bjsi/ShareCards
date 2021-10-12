import { releaseData } from "./git/release";
import { repoData } from "./git/repo";
import { deckData } from "./flashcards/deck";
import * as t from "io-ts";
import * as D from "io-ts/Decoder";

export const publishedDeck = t.type({
  release: releaseData,
  repo: repoData,
  deck: deckData,
});

export type PublishedDeck = D.TypeOf<typeof publishedDeck>;

// JSON errors
// // TODO: assign to fields, don't store release / repo etc not serializable?
// export default class PublishedDeck {

//   private readonly _release: Release;
//   private readonly _repo: Repo;
//   private readonly _deck: Deck;

//   constructor(release: Release, repo: Repo, deck: Deck) {
//     this._release = release;
//     this._repo = repo;
//     this._deck = deck;
//   }

//   get url() { const path = this.path; return `https://github.com/${path.author}/${path.repo}`; }
//   get latestReleaseUrl() { return this.url + "/releases/latest"; }

//   // Repo properties
//   get path() { return {author: this._repo.owner.login, repo: this._repo.name }}
//   get owner() { return this._repo.owner; }
//   get stars() { return this._repo.stargazers_count; }
//   get desc() { return this._repo.description; }
//   get createdAt() { return this._repo.created_at; }
//   get tags() { return this._repo.topics; }
//   get repoName() { return this._repo.name; }

//   // Deck properties
//   get elements() { return this._deck.elements; }
//   get title() { return this._deck.title; }
//   get author() { return this._deck.author; }

//   // Release properties
//   get releaseBody() { return this._release.body; }
//   get lastReleaseAt() { return this._release.published_at; }

// }
