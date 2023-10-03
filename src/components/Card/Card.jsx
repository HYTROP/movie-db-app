import React, { Component } from "react";
import { Rate } from "antd";
import { MovieService } from "../../services/MovieService";
import Genre from "../Genres/Genres";
import { format } from "date-fns";
import "./Card.css";

export default class Card extends Component {
  state = {
    voteValue: 0,
  };

  movieService = new MovieService();

  handleRatingChange = async (newRating) => {
    try {
      const { id, guestSessionId } = this.props;

      await this.movieService.postRatedMovie(newRating, id, guestSessionId);

      this.setState({
        voteValue: newRating,
      });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const {
      id,
      title,
      posterPath,
      overview,
      releaseDate,
      genreIds,
      rating,
      voteAverage,
    } = this.props;

    const { voteValue } = this.state;

    const voteAverageRound = Math.round(voteAverage * 10) / 10;

    let borderColor = "";
    if (voteAverage >= 0 && voteAverage < 3) {
      borderColor = "#E90000";
    } else if (voteAverage >= 3 && voteAverage < 5) {
      borderColor = "#E97E00";
    } else if (voteAverage >= 5 && voteAverage < 7) {
      borderColor = "#E9D100";
    } else {
      borderColor = "#66E900";
    }

    const borderStyle = {
      border: `2px solid ${borderColor}`,
    };

    if (!releaseDate) {
      return null;
    }

    function shortenDescription(overview, maxLength = 120) {
      if (window.matchMedia("(max-width: 768px)").matches) {
        maxLength = 140;
      }
      if (overview.length <= maxLength) {
        return overview;
      }
      const words = overview.split(" ");
      let shortened = "";

      for (let i = 0; i < words.length; i++) {
        if ((shortened + words[i]).length <= maxLength) {
          shortened += words[i] + " ";
        } else {
          break;
        }
      }

      return shortened.trim() + "...";
    }

    function shortenTitle(overview, maxLength = 35) {
      if (window.matchMedia("(max-width: 768px)").matches) {
        maxLength = 40;
      }
      if (overview.length <= maxLength) {
        return overview;
      }
      const words = overview.split(" ");
      let shortened = "";

      for (let i = 0; i < words.length; i++) {
        if ((shortened + words[i]).length <= maxLength) {
          shortened += words[i] + " ";
        } else {
          break;
        }
      }

      return shortened.trim() + "...";
    }

    return (
      <li key={id}>
        <div className="card">
          <div className="img-film">
            <img
              alt=""
              src={"https://image.tmdb.org/t/p/w500" + posterPath}
            ></img>
          </div>

          <div className="card-text">
            <h1 className="title">{shortenTitle(title)}</h1>
            <div className="vote" style={borderStyle}>
              <span className="vote-number">{voteAverageRound}</span>
            </div>
            <div className="data-of-release">
              {releaseDate ? format(new Date(releaseDate), "MMMM d, y") : ""}
            </div>

            <Genre className="film-tag" genreIds={genreIds} />

            <div className="card-description">
              {shortenDescription(overview)}
            </div>
            <Rate
              className="rated-stars"
              count={10}
              defaultValue={rating}
              value={rating || voteValue}
              onChange={rating ? null : this.handleRatingChange}
            />
          </div>
        </div>
      </li>
    );
  }
}
