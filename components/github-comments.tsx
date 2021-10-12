import * as A from "fp-ts/lib/Array";
import * as TE from "fp-ts/lib/TaskEither";
import {
  ListGroup,
  Button,
  Image
} from "react-bootstrap";
import * as T from "fp-ts/lib/Task";
import * as F from "fp-ts/lib/function";
import * as R from "react";
import { getIssues } from "../services/gitService";
import { Issue } from "../models/git/issue";
import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { humanRelativeDate } from '../utils/dates';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

interface VoteButtonProps {
  type: "up" | "down";
  votes: number;
}

const VoteButton = ({ type, votes }: VoteButtonProps) => {
  return (
    <Button variant="outline-dark" className="m-1 btn-sm">
      {votes}{" "}
      <FontAwesomeIcon icon={type === "up" ? faThumbsUp : faThumbsDown} />
    </Button>
  );
};

const GitHubIssueVoteButtons = ({
  issue,
}: {
  user: UserProfile;
  issue: Issue;
}) => {
  return (
    <>
      <VoteButton type={"up"} votes={issue.reactions["+1"]}></VoteButton>
      <VoteButton type={"down"} votes={issue.reactions["-1"]}></VoteButton>
    </>
  );
};

const GitHubIssue = ({ issue, user }: { user: UserProfile; issue: Issue }) => {
  const { comments } = issue;
  return (
    <ListGroup.Item className="mb-3" variant="dark" key={issue.number}>
      <Image
        className="m-2"
        style={{ float: "left" }}
        width="45px"
        height="45px"
        roundedCircle
        src={issue.user.avatar_url}
      />
      <div>
        <h5>
          <a href={issue.html_url}>{issue.title}</a>
        </h5>
        <p>
          By <a href={issue.user.html_url}>{issue.user.login}</a>{" "}
          {humanRelativeDate(issue.created_at)}
        </p>
      </div>
      <p>{issue.body}</p>
      {user && <GitHubIssueVoteButtons user={user} issue={issue} />}
      <p>
        <a href={issue.html_url}>
          {comments} comment{comments === 1 ? "" : "s"}
        </a>
      </p>
    </ListGroup.Item>
  );
};

export const GitHubComments = ({
  username,
  repo,
}: {
  username: string;
  repo: string;
}) => {
  const [issues, setIssues] = R.useState<Issue[]>([]);
  const { user } = useUser();
  R.useEffect(() => {
    F.pipe(
      getIssues(username, repo),
      TE.map(A.filter(issue => issue.state !== "closed")),
      TE.fold(
        e => {
          console.log(e);
          return T.of([]);
        },
        iss => T.of(iss),
      ),
    )().then(setIssues);
  }, []);

  return (
    <>
      <h2>Comments and Issues</h2>
      {user ? (
        <p>Welcome, {user.name}. Feel free to add a comment or vote.</p>
      ) : (
        <p>
          <a href="/api/auth/login">Sign in</a> using GitHub to add comments or
          vote.
        </p>
      )}
      <p>
        You can also browse all of the comment threads and issues directly on
        GitHub
      </p>
      <ListGroup>
        {issues.map(issue => (
          <GitHubIssue user={user} issue={issue} key={issue.number} />
        ))}
      </ListGroup>
    </>
  );
};
