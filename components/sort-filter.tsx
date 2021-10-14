import { Ord } from "fp-ts/Ord";
import * as A from "fp-ts/lib/Array";
import * as F from "fp-ts/lib/function";
import * as R from "react";
import * as B from "react-bootstrap";
import { asc, desc, SortDirection, Sorter } from "../utils/sorting";

interface ListDataFilterComponentProps<T> {
  data: T[];
}

interface NamedSorter<T> {
  name: string;
  sortBy: Sorter<T>;
}

interface NamedSortDirection {
  name: string;
  dir: SortDirection;
}

const sortAsc: NamedSortDirection = { name: "Ascending", dir: asc };
const sortDesc: NamedSortDirection = { name: "Descending", dir: desc };

export function WithSorting<T>(
  sorters: NamedSorter<T>[],
  Child?: (props: { data: T[] }) => JSX.Element,
) {
  return function ({ data }: ListDataFilterComponentProps<T>) {
    const [selected, setSelected] = R.useState<NamedSorter<T>>(sorters[0]);
    const [direction, setDirection] = R.useState(sortDesc);
    const sortedData = F.pipe(data, A.sortBy([selected.sortBy(direction.dir)]));
    return (
      <>
        <span>
          <B.DropdownButton
            variant="outline-primary"
            size="sm"
            className="d-inline m-1"
            title={`Sort By: ${selected.name}`}>
            {sorters.map(s => (
              <B.Dropdown.Item
                key={s.name}
                active={selected.name === s.name}
                onClick={() => setSelected(_ => s)}>
                {s.name}
              </B.Dropdown.Item>
            ))}
          </B.DropdownButton>
        </span>
        <span>
          <B.DropdownButton
            variant="outline-primary"
            size="sm"
            className="d-inline m-1"
            title={direction.name}>
            <B.Dropdown.Item
              active={direction.name === "Ascending"}
              onClick={() => setDirection(_ => sortAsc)}>
              Ascending
            </B.Dropdown.Item>
            <B.Dropdown.Item
              active={direction.name === "Descending"}
              onClick={() => setDirection(_ => sortDesc)}>
              Descending
            </B.Dropdown.Item>
          </B.DropdownButton>
        </span>
        <Child data={sortedData} />
      </>
    );
  };
}
