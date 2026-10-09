
export const GENRES = [
  { id: "all", name: "All Movies" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

export function filterMoviesByGenre(
  movies = [],
  selectedGenre = "all"
) {
  if (String(selectedGenre) === "all") {
    return [...movies];
  }

  const genreId = Number(selectedGenre);

  return movies.filter((movie) => {
    const genreIds = movie.genreIds ?? movie.genre_ids ?? [];
    return genreIds.includes(genreId);
  });
}
