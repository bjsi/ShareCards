import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright, faUser, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { Card, Button, Carousel } from 'react-bootstrap';
import { Deck } from '../models/deck';
import * as O from 'fp-ts/lib/Option';
import Link from 'next/link';
import Flashcard from './card';

interface FlashcardDeckProps {
  deck: Deck
}

export default function FlashcardDeck({deck}: FlashcardDeckProps) {
  const cards = deck.elements;
  return (
    <>
    <Card border="dark" className="m-2" style={{width: "25rem"}}>
    <Carousel fade>
      {
        cards.map((card, idx) => 
          <Carousel.Item key={idx} interval={7000}>
            <Flashcard isPreview={true} data={card}/>
          </Carousel.Item>
          )
      }
      </Carousel>

    <Card.Body>
	    <Card.Title>{deck.title}</Card.Title>
	    <Card.Subtitle>
      <FontAwesomeIcon icon={faUser} /> <Link href={`/${deck.username}`}><a>{deck.author}</a></Link>
      <br/>
      <FontAwesomeIcon icon={faStickyNote} /> {`${cards.length} card${cards.length === 1 ? "" : "s"}`}
      </Card.Subtitle>
	    <Card.Text>
		    {O.getOrElse(() => "No description available for this deck")(deck.description)}
	    </Card.Text>
	    <Link href={`/${deck.username}/${deck.repository}`}>
    <Button variant="outline-dark">Browse this deck</Button>
	</Link>
    </Card.Body>
    </Card>
    </>
  );
}
