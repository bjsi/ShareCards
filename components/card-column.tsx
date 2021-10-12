import * as R from "react";
import Masonry from "react-masonry-css";

interface CardColumnsProps {
  children: R.ReactNode;
}

export const CardColumns = ({ children }: CardColumnsProps) => {
  return (
    <Masonry
      breakpointCols={2}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column">
      {children}
    </Masonry>
  );
};
