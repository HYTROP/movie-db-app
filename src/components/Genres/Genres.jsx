import React from "react";

import { Consumer } from "../../services/GenresContext";
import "./Genres.css";

function Genre({ genreIds }) {
  return (
    <Consumer>
      {(genres) => {
        const genreSpans = genreIds
          .map((id) => {
            const genre = genres.find((genreList) => genreList.id === id);

            if (genre) {
              return (
                <span key={genre.id} className="genre-span">
                  {genre.name}
                </span>
              );
            }

            return null;
          })
          .slice(0, 4);

        return <div className="genre-tags">{genreSpans}</div>;
      }}
    </Consumer>
  );
}

export default Genre;
