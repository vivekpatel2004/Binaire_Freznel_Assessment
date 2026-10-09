
import { useEffect } from "react";
import { X, Star, CalendarDays, Film } from "lucide-react";

export default function MovieModal({ movie, onClose }) {
  useEffect(() => {
    if (!movie) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const title = movie.title || "Untitled Movie";
  const overview = movie.overview || "No description available.";
  const rating = Number(movie.rating ?? movie.vote_average ?? 0);
  const releaseDate = movie.releaseDate ?? movie.release_date ?? "";
  const posterPath = movie.posterPath ?? movie.poster_path;
  const backdropPath = movie.backdropPath ?? movie.backdrop_path;
  const imagePath = backdropPath || posterPath;

  const imageUrl = imagePath
    ? `https://image.tmdb.org/t/p/w1280${imagePath}`
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-gray-950 text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          <X size={22} />
        </button>

        <div className="relative min-h-48 bg-gray-900 sm:min-h-64">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex min-h-48 items-center justify-center sm:min-h-64">
              <Film size={48} className="text-gray-600" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-black/10" />

          <div className="relative flex min-h-48 items-end p-6 sm:min-h-64 sm:p-8">
            <div>
              <h2
                id="movie-modal-title"
                className="text-3xl font-bold sm:text-4xl"
              >
                {title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  {rating.toFixed(1)} / 10
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays size={16} />
                  {releaseDate || "Release date unavailable"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold">Overview</h3>

          <p className="mt-3 whitespace-pre-line leading-7 text-gray-300">
            {overview}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Close Details
          </button>
        </div>
      </section>
    </div>
  );
}
