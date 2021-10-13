import {PublishedDeck} from '../models/publishedDeck';
import { CardColumns } from "../components/card-column";
import FlashcardDeck from "../components/deck";

export const DecksContainer = ({ data }: { data: PublishedDeck[] }) => {
  return (
    <CardColumns>
      {data.map(deck => (
        <FlashcardDeck
          key={`${deck.deck.title} ${deck.repo.owner.login}`}
          deck={deck}
        />
      ))}
    </CardColumns>
  );
};
