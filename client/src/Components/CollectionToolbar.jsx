import React from "react";
import { SORT_LABELS } from "../constants/collection";

const CollectionToolbar = ({
  visibleCount,
  totalCount,
  sortOption,
  onSortClick,
}) => {
  return (
    <div className="collection__toolbar">
      <button className="collection__sort" onClick={onSortClick}>
        {SORT_LABELS[sortOption]}
      </button>
      <span className="collection__toolbar-count">
        {visibleCount} of {totalCount} products
      </span>
    </div>
  );
};

export default CollectionToolbar;
