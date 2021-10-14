import { Layout } from "../components/layout";
import Meta from "../components/seo-meta";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import { getAllPublishedDecks } from "../lib/api";
import { GetStaticProps } from "next";
import * as F from "fp-ts/lib/function";
import { PublishedDeck } from "../models/publishedDeck";
import { Card, Image } from "react-bootstrap";
import { GitHubComments } from "../components/github-comments";
import Link from "next/link";
import { uniqueByKey } from "../utils/filtering";
import { FilterableTiledDecks } from "../components/filterable-decks";

export interface HomeProps {
  decks: PublishedDeck[];
}

export default function Home({ decks }: HomeProps) {
  const authors = decks.map(deck => ({
    ...deck.repo.owner,
    name: deck.deck.author,
  }));
  const uniqueAuthors = uniqueByKey(authors, a => a.login);

  return (
    <Layout meta={<Meta title="Home" desc={O.none} canonical="TODO" />}>
      <p>
        <b>Share Cards</b> is a flashcard sharing website for SuperMemo users.
        Share Cards is built entirely on top of GitHub, allowing deck authors to
        effortlessly share their masterpieces with the community through GitHub
        repositories. Commenting, liking, voting and downloading is all
        implemented through GitHub, so even if Share Cards dies, deck owners'
        data, comments and stars will live on!
      </p>

      <h2>Contributors</h2>
      <p>
        Since Share Cards has been running, {uniqueAuthors.length} people have
        shared decks. If you are interested in sharing a deck, check out the{" "}
        <Link href="/guide">
          <a>deck authoring guide</a>
        </Link>
        .
      </p>
      {uniqueAuthors.map((author, idx) => (
        <>
          <Link href={`/${author.login}`}>
            <a>
              <Image
                key={idx}
                className="mx-1"
                width="45px"
                height="45px"
                roundedCircle
                alt={`${author.name} avatar`}
                src={author.avatar_url}
              />
            </a>
          </Link>
          <div className="mx-1" style={{ width: "45px", textAlign: "center" }}>
            <Link href={`/${author.login}`}>
              <a>{author.login}</a>
            </Link>
          </div>
        </>
      ))}

      <h2>Decks</h2>
      <p>
        Browse some of the community's most popular decks by using tags or
        search...
      </p>

      {decks.length === 0 ? (
        <p>No decks available. Check back later!</p>
      ) : (
        <FilterableTiledDecks data={decks} />
      )}

      <hr />
      <GitHubComments username={"bjsi"} repo={"ShareCards"}>
        <p>
          Share Cards is a work in progress. If there are any features you want
          to see or if you encounter any bugs, don't hesitate to leave a
          comment.
        </p>
      </GitHubComments>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return await F.pipe(
    getAllPublishedDecks(),
    T.map(results => ({ props: { decks: results } })),
  )();
};
