
export function sortMovies(movies = [], sortBy = "popularity") {
  const sortedMovies = [...movies];

  switch (sortBy) {
    case "rating":
      return sortedMovies.sort(
        (a, b) =>
          (b.rating ?? b.vote_average ?? 0) -
          (a.rating ?? a.vote_average ?? 0)
      );

    case "newest":
      return sortedMovies.sort(
        (a, b) =>
          new Date(b.releaseDate ?? b.release_date ?? 0) -
          new Date(a.releaseDate ?? a.release_date ?? 0)
      );

    case "popularity":
    default:
      return sortedMovies.sort(
        (a, b) =>
          (b.popularity ?? 0) - (a.popularity ?? 0)
      );
  }
}
