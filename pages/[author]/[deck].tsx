import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import ErrorPage from "next/error";
import * as TE from "fp-ts/lib/TaskEither";
import { ListGroup, ButtonGroup, Media,Row, Col, Image, Button } from "react-bootstrap";
import Meta from "../../components/seo-meta";
import * as T from "fp-ts/lib/Task";
import * as F from "fp-ts/lib/function";
import { Deck } from "../../models/deck";
import { getAllDeckPaths, getDeckByName } from "../../lib/api";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps, GetStaticPaths } from "next";
import { warn } from "fp-ts/lib/Console";
import * as path from 'path';
import { decksDir } from "../../lib/filesystem";
import Flashcard from '../../components/card';
import * as R from 'react';
import {getIssues} from '../../services/gitService';
import { Issue } from "../../models/issue";
import { Layout } from '../../components/layout';
import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

interface DeckPageProps {
  maybeDeck: O.Option<Deck>;
}

interface Params extends ParsedUrlQuery {
  author: string;
  deck: string;
}

const prettyDate = (iso: string) => dayjs(new Date(iso)).fromNow();

interface VoteButtonProps {
	type: "up" | "down";
	votes: number;
}

const VoteButton = ({ type, votes}: VoteButtonProps) => {
	return (
	<Button variant="outline-dark"
		className="m-1 btn-sm"
		>{votes} <FontAwesomeIcon icon={type === "up" ? faThumbsUp : faThumbsDown}/>
	</Button>
	);
}


const GitHubIssueVoteButtons = ({issue}: {user: UserProfile, issue: Issue}) => {
	return (
	<>
		<VoteButton type={"up"} votes={issue.reactions["+1"]}></VoteButton>
		<VoteButton type={"down"} votes={issue.reactions["-1"]}></VoteButton>
	</>
	)
}

const GitHubIssue = ({issue, user}: {user: UserProfile, issue: Issue}) => {
   const {comments} = issue;
   return (
      <ListGroup.Item className="mb-3" variant="dark" key={issue.number}>
	<Image className="m-2" style={{float: "left"}} width="45px" height="45px" roundedCircle src={issue.user.avatar_url}/>
	<div>
	  <h5><a href={issue.html_url}>{issue.title}</a></h5>
	  <p>By <a href={issue.user.html_url}>{issue.user.login}</a> {prettyDate(issue.created_at)}</p>
	</div>
	  <p>{issue.body}</p>
	  {
	    user && <GitHubIssueVoteButtons user={user} issue={issue} />
    	  }
	  <p><a href={issue.html_url}>{comments} comment{comments === 1 ? "" : "s"}</a></p>
      </ListGroup.Item>
   )
}

const GitHubIssues = ({username, repo}: {username: string, repo: string}) => {
      const [issues, setIssues] = R.useState<Issue[]>([]);
      const {user} = useUser();
      R.useEffect(() => {
        F.pipe(
          getIssues(username, repo),
          TE.map(A.filter(issue => issue.state !== "closed")),
          TE.fold(
            (e) => {console.log(e); return T.of([])},
            iss => T.of(iss),
          )
        )().then(setIssues);
      }, []);

      return (
        <>
        <h2>Comments and Issues</h2>
        {
		user ? <p>Welcome, {user.name}. Feel free to add a comment or vote.</p>
		     : <p><a href='/api/auth/login'>Sign in</a> using GitHub to add comments or vote.</p>
	}
	<p>You can also browse all of the comment threads and issues directly on GitHub</p>
        <ListGroup >
          {
            issues.map(issue => <GitHubIssue user={user} issue={issue} key={issue.number}/>)
          }
        </ListGroup>
        </>
      );
}

export default function DeckPage({ maybeDeck }: DeckPageProps) {
  if (O.isNone(maybeDeck)) {
    return <ErrorPage statusCode={404} />;
  } else {
      const deck = maybeDeck.value;
      const cards = deck.elements;
    return (
      <Layout meta={<Meta title={deck.title} desc={O.none} canonical="TODO" />}>
          <h1>{deck.title}</h1>
          <p>
            {O.getOrElse(() => "No description available for this deck.")(
              deck.description,
            )}
          </p>
          <p>
          There are {`${cards.length} card${cards.length === 1 ? "" : "s"}`} available in this deck.
          </p>
          {
            cards.map((card, idx) => 
              <Flashcard key={idx} isPreview={false} data={card}/>)
          }
          <hr/>
          <GitHubIssues username={deck.username} repo={deck.repository}/>
      </Layout>
    );
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return F.pipe(
  	getAllDeckPaths,
  	E.fold(
  	  e => { warn(e); return {paths: [], fallback: false}},
  F.flow(
      A.map(fp => path.relative(decksDir, fp).replace(/\.json/, '').split('/')),
  		A.map(([author, deck]) => ({params: {author, deck }})),
  		params => ({paths: params, fallback: false})
  	)),
  )
};

export const getStaticProps: GetStaticProps<DeckPageProps, Params> =
  async context => {
    return await F.pipe(
      context?.params!,
      ({ author, deck }) => getDeckByName(author, deck),
      TE.fold(
        e => {
          warn(e);
          return T.of({ props: { maybeDeck: O.none } });
        },
        deck => T.of({ props: { maybeDeck: O.some(deck) } }),
      ),
    )();
  };
