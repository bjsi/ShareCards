import { Repo } from "./models/git/repo";
import { Release } from "./models/git/release";
import { Deck } from "./models/flashcards/deck";
import {
  fullDeckBasePath,
  fullDeckDataPath,
  fullReleaseDataPath,
  fullRepoDataPath,
  makeDir,
  writeJson,
} from "./lib/filesystem";
import {
  downloadLatestRelease,
  getLatestRelease,
  getRepo,
} from "./services/gitService";
import * as F from "fp-ts/lib/function";
import { DeckPathSegment, getCommunityDeckListPathSegments } from "./lib/api";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import * as T from "fp-ts/lib/Task";

// MAIN
const run = F.pipe(
  getCommunityDeckListPathSegments(),
  T.map(A.traverse(T.task)(segments => T.of(updateRepoInfo(segments)))),
);

run();

const writeRepo = (repo: Repo) =>
  writeJson(fullRepoDataPath(repo.owner.login, repo.name), repo);

const writeReleaseInfo = (release: Release, user: string, repo: string) =>
  writeJson(fullReleaseDataPath(user, repo), release);

const writeLatestDeck = (deck: Deck, user: string, repo: string) =>
  writeJson(fullDeckDataPath(user, repo), deck);

const updateRepoInfo = async ({ author, deck }: DeckPathSegment) => {
  const createDirRes = await makeDir(fullDeckBasePath(author, deck))();
  if (E.isLeft(createDirRes)) {
    console.log(
      `Failed to create deck directory: ${author}/${deck} with error: ${createDirRes.left.message}`,
    );
    return;
  }

  console.log(`Downloading latest repository metadata for ${author}/${deck}`);
  await F.pipe(getRepo(author, deck), TE.chain(writeRepo))();

  console.log(`Downloading latest release info for ${author}/${deck}`);
  const mrelease = await getLatestRelease(author, deck)();
  if (E.isLeft(mrelease)) {
    console.log(
      `Failed to get latest release info for ${author}/${deck} with error: ${mrelease.left.message}`,
    );
    return;
  } else {
    const release = mrelease.right;
    const assets = release.assets;
    const asset = assets.filter(asset => asset.name === "deck.json")[0];
    if (!asset) {
      console.log(
        `Latest release for for ${author}/${deck} contains no deck.json asset`,
      );
      return;
    }

    const mdeck = await downloadLatestRelease(asset.browser_download_url)();

    console.log(`Downloading latest release for ${author}/${deck}`);
    if (E.isLeft(mdeck)) {
      console.log(`Failed to download latest release for ${author}/${deck}`);
      console.log(mdeck.left.message);
      return;
    } else {
      const deckdata = mdeck.right;
      await Promise.all([
        writeReleaseInfo(release, author, deck)(),
        writeLatestDeck(deckdata, author, deck)(),
      ]);
    }
  }
};
