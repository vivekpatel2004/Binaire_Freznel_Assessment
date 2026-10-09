import { Film, Play, Search } from "lucide-react";

export default function HeroBanner({
  movies = [],
  onMovieClick,
  onExploreClick,
  onSearchClick,
}) {
  const featured = movies.slice(0, 4);
  const hero = featured[0];
  const heroBackdrop = hero?.backdropPath ?? hero?.backdrop_path;
  const imageUrl = (path, size = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

  return (
    <section className="relative mb-12 min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#111827] sm:min-h-[490px]">
      {hero?.backdrop_path && (
        <img
          src={imageUrl(hero.backdrop_path, "w1280")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/85 to-[#0d1117]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />

      <div className="relative z-10 grid min-h-[420px] items-center gap-8 p-7 sm:min-h-[490px] sm:p-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
            <Film size={17} className="mr-2" />
            Your movie discovery platform
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
            {hero?.title || "Movies worth watching."}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
            {hero?.overview
              ? `${hero.overview.slice(0, 180)}${hero.overview.length > 180 ? "…" : ""}`
              : "Discover popular films, explore new stories, and find your next movie night favourite."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {hero && (
              <button
                type="button"
                onClick={() => onMovieClick?.(hero)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
              >
                <Play size={18} fill="currentColor" />
                View Movie
              </button>
            )}

            <button
              type="button"
              onClick={onSearchClick}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold hover:bg-white/15"
            >
              <Search size={18} />
              Find a Movie
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 items-end gap-2 sm:gap-3">
          {featured.map((movie, index) => {
            const posterPath = movie.posterPath ?? movie.poster_path;

            return (
              <button
                type="button"
                key={movie.id}
                onClick={() => onMovieClick?.(movie)}
                aria-label={`View ${movie.title}`}
                className={`group relative overflow-hidden rounded-xl border border-white/15 bg-gray-900 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-red-400 ${
                  index % 2 === 0
                    ? "aspect-[2/3]"
                    : "aspect-[2/3] translate-y-5"
                }`}
              >
                {posterPath ? (
                  <img
                    src={imageUrl(posterPath)}
                    alt={movie.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Film />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                <span className="absolute bottom-2 left-1 right-1 line-clamp-2 text-left text-[10px] font-semibold sm:text-xs">
                  {movie.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
