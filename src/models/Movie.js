export default class Movie {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? "Untitled Movie";
    this.overview = data.overview ?? "";
    this.posterPath = data.poster_path ?? null;
    this.backdropPath = data.backdrop_path ?? null;
    this.releaseDate = data.release_date ?? "";
    this.rating = Number(data.vote_average ?? 0);
    this.popularity = Number(data.popularity ?? 0);
    this.genreIds = Array.isArray(data.genre_ids)
      ? [...data.genre_ids]
      : [];
  }

  get year() {
    return this.releaseDate
      ? this.releaseDate.slice(0, 4)
      : "Release TBA";
  }

  get formattedRating() {
    return this.rating.toFixed(1);
  }

  getPosterUrl(size = "w500") {
    return this.posterPath
      ? `https://image.tmdb.org/t/p/${size}${this.posterPath}`
      : null;
  }

  getBackdropUrl(size = "w1280") {
    return this.backdropPath
      ? `https://image.tmdb.org/t/p/${size}${this.backdropPath}`
      : null;
  }

  hasGenre(genreId) {
    return this.genreIds.includes(Number(genreId));
  }

  static fromAPI(data) {
    return new Movie(data);
  }

  static fromAPIList(results = []) {
    return results.map((item) => Movie.fromAPI(item));
  }
}
