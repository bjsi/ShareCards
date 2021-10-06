import Head from "next/head";
import * as O from "fp-ts/lib/Option";
import { MetaData } from "../lib/pageContent";
import { pipe } from "fp-ts/lib/function";

interface MetaProps extends MetaData {
  canonical: string;
}

const Meta = (props: MetaProps) => {
  const desc = pipe(
    props.desc,
    O.getOrElse(() => "A flashcard sharing website for SuperMemo users."),
  );
  return (
    <Head>
      <title>{props.title} | Share Cards</title>
      <meta name="description" content={desc} />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={props.title} />
      <meta name="og:description" property="og:description" content={desc} />
      <meta property="og:site_name" content="Share Cards" />
      <meta property="og:url" content={`${props.canonical}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:site" content="@experilearning" />
      <meta name="twitter:creator" content="@experilearning" />
      <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
      <link rel="apple-touch-icon" href="/assets/images/favicon.ico" />
      {props.canonical && <link rel="canonical" href={`${props.canonical}`} />}
    </Head>
  );
};
export default Meta;
