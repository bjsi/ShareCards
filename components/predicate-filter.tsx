import { Predicate } from "fp-ts/lib/Predicate";
import * as B from "react-bootstrap";
import * as R from "react";

interface ListDataFilterComponentProps<T> {
  data: T[];
}

interface NamedPredicate<T> {
  name: string;
  filterBy: Predicate<T>;
}

export function WithPredicateFiltering<T>(
  filters: Array<NamedPredicate<T>>,
  Child?: (props: { data: T[] }) => JSX.Element,
) {
  return function ({ data }: ListDataFilterComponentProps<T>) {
    const [selected, setSelected] = R.useState(filters[0]);
    const filteredData = data.filter(selected.filterBy);
    return (
      <>
        <B.DropdownButton
          variant="secondary"
          size="sm"
          className="d-inline m-1"
          title={`Filter By: ${selected.name}`}>
          {filters.map(f => (
            <B.Dropdown.Item
              key={f.name}
              active={selected.name === f.name}
              onClick={() => setSelected(_ => f)}>
              {f.name}
            </B.Dropdown.Item>
          ))}
        </B.DropdownButton>
        <Child data={filteredData} />
      </>
    );
  };
}
