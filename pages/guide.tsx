import { Layout } from "../components/layout";
import * as O from "fp-ts/lib/Option";
import Meta from "../components/seo-meta";
import { fullPostPath, postsBaseDir } from "../lib/filesystem";

export default function Guide() {
  const title = "How to upload a flashcard deck";
  return (
    <Layout meta={<Meta title={title} desc={O.some(title)} canonical="TODO" />}>
      <h1>How to Upload a Deck</h1>
      <p>Coming soon...</p>
    </Layout>
  );
}

// export const getStaticProps: GetStaticProps<TagPageProps, Params> =
//   async context => {
//     const guide = fullPostPath("upload-guide.md");
//     return await F.pipe(
//       context?.params!,
//       ({tag}) =>
//         F.pipe(
//           getAllPublishedDecks(),
//           T.map(A.filter(deck => deck.repo.topics.some(topic => topic === tag))),
//           T.map(decks => ({ props: { decks, tag } })),
//       ),
//     )();
//   };
