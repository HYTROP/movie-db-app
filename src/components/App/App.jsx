import React, { Component } from "react";

import { MovieService } from "../../services/MovieService";
import { Provider } from "../../services/GenresContext";

import Spinner from "../../Spin/Spin";

import ErrorIndicator from "../MovieList/ErrorIndicator";

import "./App.css";
import { debounce } from "lodash";
import { Pagination, Tabs } from "antd";
import MovieList from "../MovieList/MovieList";

export default class App extends Component {
  movieService = new MovieService();

  state = {
    moviesData: [],
    searchInput: "",
    query: "",
    loading: true,
    error: false,
    isOnline: navigator.onLine,
    pageNumber: 1,
    ratedCurrentPage: 1,
    ratedTotalPages: 1,
    ratedMovies: [],
    genres: [],
    genreIds: [],
    guestSessionId: "",
    activeTab: "Search",
    movieRatings: [],
    voteValue: 0,
  };

  onError = (err) => {
    window.dispatchEvent(new Event("offline"));
    this.setState({
      error: true,
      loading: false,
      offline: false,
    });
    return err;
  };

  async componentDidMount() {
    window.addEventListener("online", this.handleNetworkChange);
    window.addEventListener("offline", this.handleNetworkChange);

    try {
      const guestSessionId = await this.movieService.getGuestSession();
      const genresData = await this.movieService.getGenres();

      this.setState(
        {
          guestSessionId: guestSessionId.guest_session_id,
          genres: genresData.genres,
        },
        () => {
          this.fetchMovies();

          if (this.state.query === this.state.searchInput) {
            this.setState(
              { searchInput: this.state.query, loading: true },
              () => this.fetchMovies(this.state.query, this.state.pageNumber)
            );
          }
        }
      );
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }

  fetchMovies = debounce(async () => {
    try {
      const { query, pageNumber } = this.state;
      const data = await this.movieService.getSearchMovies(query, pageNumber);
      const totalItems = data.total_results;
      const totalPages = data.total_pages;

      this.setState({
        moviesData: data.results,
        loading: false,
        error: false,
        totalItems,
        totalPages,
      });
    } catch (error) {
      this.onError(error);
    }
  }, 500);

  handleVoteRated = async (key, page = 1) => {
    this.setState({ activeTab: key });
    if (key === "Rated") {
      try {
        const { guestSessionId } = this.state;
        const ratedMovieData = await this.movieService.getRatedMovies(
          guestSessionId,
          page
        );

        const movieRatings = {};
        ratedMovieData.results.forEach((item) => {
          movieRatings[item.id] = item.rating;
        });

        this.setState({
          ratedMovies: ratedMovieData.results,
          ratedCurrentPage: ratedMovieData.page,
          ratedTotalPages: ratedMovieData.total_pages,
        });
      } catch (err) {
        throw new Error(err);
      }
    }
  };

  handleChangeQuery = (event) => {
    const query = event.target.value;
    if (!this.state.query.trim() && query.startsWith(" ")) {
      return;
    }
    this.setState({ query }, this.fetchMovies);
  };

  handlePageChange = (pageNumber) => {
    this.setState({ pageNumber }, this.fetchMovies, this.scrollToTop());
  };

  handleNetworkChange = () => {
    this.setState({ isOnline: navigator.onLine });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    const {
      moviesData,
      loading,
      error,
      isOnline,
      query,
      pageNumber,
      ratedMovies,
      guestSessionId,
      activeTab,
      totalItems,
      voteValue,
    } = this.state;

    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorIndicator />;
    }

    const item = [
      {
        key: "Search",
        label: "Search",
        children: (
          <div className="tab-content" key="tab1">
            <div className="search-block">
              <div className="search-panel">
                <input
                  id="id"
                  className="search-input"
                  type="search"
                  placeholder="Type to search..."
                  autoFocus
                  value={query}
                  onChange={this.handleChangeQuery}
                />
              </div>
            </div>

            <ul className="card-box">
              {query.trim() === "" && (
                <div className="search-start-message">
                  <p>Начните вводить название фильма.</p>
                </div>
              )}

              {moviesData.length === 0 && query.trim() !== "" && (
                <div className="not-found">
                  <p>
                    Мы не смогли найти ни одного фильма по Вашему запросу.
                    Пожалуйста, измените запрос.
                  </p>
                </div>
              )}

              <MovieList
                moviesData={moviesData}
                loading={loading}
                guestSessionId={guestSessionId}
                ratedMovies={ratedMovies}
                activeTab={activeTab}
                voteValue={voteValue}
              />
            </ul>

            {moviesData.length !== 0 && (
              <div className="paggy">
                <div className="pagination-container">
                  <Pagination
                    defaultCurrent={1}
                    style={{
                      display: "flex",
                      margin: "0 auto",
                      width: 300,
                    }}
                    current={pageNumber}
                    total={totalItems}
                    onChange={this.handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "Rated",
        label: "Rated",
        children: (
          <div className="tab-content-rate" key="tab2">
            <MovieList moviesData={this.state.ratedMovies} />
          </div>
        ),
      },
    ];

    return (
      <Provider value={this.state.genres}>
        <main>
          <div className="offline-message">
            {!isOnline && (
              <div className="isOffline">
                <p>
                  Отсутствует подключение к интернету. Проверьте сетевое
                  соединение и попробуйте еще раз.
                </p>
              </div>
            )}
          </div>
          <Tabs
            defaultActiveKey="tab1"
            centered
            items={item}
            onChange={(key) => this.handleVoteRated(key)}
          />
        </main>
      </Provider>
    );
  }
}
