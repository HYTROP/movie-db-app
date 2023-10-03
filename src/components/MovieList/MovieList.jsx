import React from "react";

import Card from "../Card/Card";
import "../App/App.css";

function MovieList(props) {
  const { moviesData, guestSessionId } = props;

  const movieElements = moviesData.map((item) => (
    <Card
      key={item.id}
      id={item.id}
      title={item.title}
      releaseDate={item.release_date}
      overview={item.overview}
      posterPath={item.poster_path}
      voteAverage={item.vote_average}
      genreIds={item.genre_ids}
      guestSessionId={guestSessionId}
      rating={item.rating}
    />
  ));

  return <>{movieElements}</>;
}
export default MovieList;
