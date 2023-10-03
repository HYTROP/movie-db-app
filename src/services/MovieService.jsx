export class MovieService {
  _apiBase = "https://api.themoviedb.org/3/";
  _apiKey = "6dce2a79655cf9304a13d5633dead5ab";

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}&api_key=${this._apiKey}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${res.status}`);
    }
    return res.json();
  }

  async getSearchMovies(query, pageNumber) {
    return this.getResource(
      `search/movie?&query=${query}&page=${pageNumber}&include_adult=false`
    );
  }

  async getGuestSession() {
    const res = await fetch(
      `${this._apiBase}/authentication/guest_session/new?${this._apiKey}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZGNlMmE3OTY1NWNmOTMwNGExM2Q1NjMzZGVhZDVhYiIsInN1YiI6IjY1MGY0MDIyZjI5ZDY2MDBlMjU3YmUxOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IkW5ktgyV3w83buHB3x70opF0pEcOjKYR_yvdav6OqQ",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Could not fetch ${res.status}`);
    }
    return res.json();
  }

  async getGenres() {
    const res = await fetch(
      `${this._apiBase}/genre/movie/list?language=en&api_key=${this._apiKey}`
    );

    if (!res.ok) {
      throw new Error(`Could not fetch ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  async postRatedMovie(voteRating, movieId, guestSessionId) {
    const option = {
      method: "Post",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
      body: `{"value": ${voteRating}}`,
    };

    const res = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?guest_session_id=${guestSessionId}&api_key=${this._apiKey}`,
      option
    );

    if (!res.ok) {
      throw new Error(`Fetch add vote dont work ${res.status}`);
    }
  }

  async getRatedMovies(guestSessionId, pageNumber) {
    const res = await fetch(
      `${this._apiBase}guest_session/${guestSessionId}/rated/movies?page=${pageNumber}&api_key=${this._apiKey}&language=en-US&sort_by=created_at.asc`
    );

    if (!res.ok) {
      throw new Error(`Fetch error ${res.status}`);
    }

    const body = res.json();

    return body;
  }
}
