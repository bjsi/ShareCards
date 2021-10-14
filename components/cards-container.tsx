import { CardColumns } from "../components/card-column";
import Flashcard from "../components/card";
import { Element } from "../models/flashcards/cards";

export const CardsContainer = ({ data }: { data: Element[] }) => {
  return (
    <CardColumns>
      {data.map((card, idx) => (
        <Flashcard key={idx} isPreview={false} data={card} />
      ))}
    </CardColumns>
  );
};
