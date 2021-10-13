import * as R from 'react';
import { Button } from 'react-bootstrap';
import { PublishedDeck } from '../models/publishedDeck';

interface ListDataFilterComponentProps<T> {
  data: T[];
}

interface ToggleFilterButtonProps {
  text: string;
  setActiveToggles: R.Dispatch<R.SetStateAction<Set<string>>>;
  activeToggles: Set<string>;
}

function ToggleFilterButton({
  text,
  setActiveToggles,
  activeToggles,
}: ToggleFilterButtonProps) {
  const handleClick = () => {
    setActiveToggles(last =>
      last.has(text)
        ? new Set<string>([...last].filter(x => x !== text))
        : new Set<string>([...last, text]),
    );
  };
  return (
    <Button
      onClick={() => handleClick()}
      className="btn-sm m-1"
      variant={`${activeToggles.has(text) ? "" : "outline-"}primary`}>
      {text}
    </Button>
  );
}

export function WithToggleButtonFiltering<T>(
  getToggles: (data: T[]) => Set<string>,
  predicate: (toggles: Set<string>, data: T) => boolean,
  Child?: (props: { data: T[] }) => JSX.Element,
) {
  return function ({ data }: ListDataFilterComponentProps<T>) {
    const toggles = getToggles(data);
    const [activeToggles, setActiveToggles] = R.useState(toggles);
    const filteredData = data.filter(x => predicate(activeToggles, x))

    return (
      <>
        {Array.from(toggles).map(toggle => (
          <ToggleFilterButton 
            setActiveToggles={setActiveToggles}
            activeToggles={activeToggles}
           text={toggle}
            key={toggle}
          />
        ))}
        <Child data={filteredData} />
      </>
    );
  };
}

// Utilities

export const toggleFilterDecks = (toggles: Set<String>, deck: PublishedDeck) => {
  return deck.repo.topics.some(topic => toggles.has(topic));
};
