
import { Star, CalendarDays, Film } from "lucide-react";

export default function MovieGrid({
  movies = [],
  loading = false,
  onMovieClick,
}) {
  if (loading && movies.length === 0) {
    return (
      <div
        className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        aria-label="Loading movies"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-xl bg-gray-900"
          >
            <div className="aspect-[2/3] bg-gray-800" />
            <div className="space-y-3 p-3">
              <div className="h-4 rounded bg-gray-800" />
              <div className="h-3 w-2/3 rounded bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 px-6 py-14 text-center text-gray-400">
        <Film size={40} className="mx-auto mb-4 text-gray-600" />
        <h3 className="text-lg font-semibold text-white">
          No movies found
        </h3>
        <p className="mt-2 text-sm">
          Try another search or choose a different genre.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => {
        const posterPath = movie.posterPath ?? movie.poster_path;
        const title = movie.title || "Untitled Movie";
        const rating = Number(movie.rating ?? movie.vote_average ?? 0);
        const releaseDate = movie.releaseDate ?? movie.release_date ?? "";

        const posterUrl = posterPath
          ? `https://image.tmdb.org/t/p/w500${posterPath}`
          : null;

        return (
          <button
            key={movie.id}
            type="button"
            onClick={() => onMovieClick?.(movie)}
            className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-950/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label={`View details for ${title}`}
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${title} poster`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <Film size={42} />
                </div>
              )}

              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-1 text-sm font-semibold text-yellow-400">
                <Star size={14} fill="currentColor" />
                {rating.toFixed(1)}
              </div>
            </div>

            <div className="p-3">
              <h3 className="line-clamp-2 min-h-10 font-semibold text-white transition group-hover:text-blue-400">
                {title}
              </h3>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-400">
                <CalendarDays size={14} />
                {releaseDate
                  ? releaseDate.slice(0, 4)
                  : "Release TBA"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
