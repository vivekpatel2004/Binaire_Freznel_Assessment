
import tmdbApi from "../api/TMDBApi";
import Movie from "../models/Movie";

export async function searchMovies(query, page = 1) {
  const term = query.trim();

  if (!term) {
    const data = await tmdbApi.getPopularMovies(page);
    return {
      ...data,
      results: Movie.fromAPIList(data.results ?? []),
    };
  }

  const data = await tmdbApi.searchMovies(term, page);

  return {
    ...data,
    results: Movie.fromAPIList(data.results ?? []),
  };
}

export async function getPopularMovies(page = 1) {
  const data = await tmdbApi.getPopularMovies(page);

  return {
    ...data,
    results: Movie.fromAPIList(data.results ?? []),
  };
}
