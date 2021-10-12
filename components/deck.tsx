import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FA from "@fortawesome/free-solid-svg-icons";
import { Card, Button, Carousel, Badge } from "react-bootstrap";
import { PublishedDeck } from "../models/publishedDeck";
import Link from "next/link";
import Flashcard from "./card";
import { humanRelativeDate } from "../utils/dates";

export default function FlashcardDeck({ deck }: { deck: PublishedDeck }) {
  const cards = deck.deck.elements;
  const stars = deck.repo.stargazers_count;
  return (
    <>
      <Card border="dark" className="m-2">
        <Carousel fade>
          {cards.map((card, idx) => (
            <Carousel.Item key={idx} interval={7000}>
              <Flashcard isPreview={true} data={card} />
            </Carousel.Item>
          ))}
        </Carousel>

        <Card.Body>
          <Card.Title>{deck.deck.title}</Card.Title>
          <Card.Subtitle>
            <FontAwesomeIcon size="sm" icon={FA.faUser} />{" "}
            <Link href={`/${deck.repo.owner.login}`}>
              <a>{deck.deck.author}</a>
            </Link>
            <br />
            <FontAwesomeIcon size="sm" icon={FA.faStickyNote} />{" "}
            {`${cards.length} card${cards.length === 1 ? "" : "s"}`}
            <br />
            <FontAwesomeIcon size="sm" icon={FA.faStar} />{" "}
            {`${stars} star${stars === 1 ? "" : "s"}`}
            <br />
            <FontAwesomeIcon size="sm" icon={FA.faCalendar} /> Latest release{" "}
            {humanRelativeDate(deck.release.published_at)}
            <br />
          </Card.Subtitle>
          <Card.Text>
            <p>
              {deck.repo.description.length === 0
                ? "No description available for this deck"
                : deck.repo.description}
            </p>
          </Card.Text>
          <span>
            <Link href={`/${deck.repo.owner.login}/${deck.repo.name}`}>
              <Button className="btn-sm" variant="outline-dark">
                Show Cards
              </Button>
            </Link>
          </span>
          <span style={{ float: "right" }}>
            {deck.repo.topics.map((tag, idx) => (
              <Badge key={idx} variant="success" className="m-1">
                {tag}
              </Badge>
            ))}
          </span>
        </Card.Body>
      </Card>
    </>
  );
}
