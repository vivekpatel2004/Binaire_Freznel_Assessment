import { useEffect, useMemo, useState } from "react";
import { Film, Play, Search } from "lucide-react";
import tmdbApi from "../../api/TMDBApi";

const ROTATION_KEY = "cinescope-hero-rotation";
const RESET_HOUR = 12;

function getNextResetTime(now = new Date()) {
  const nextReset = new Date(now);
  nextReset.setHours(RESET_HOUR, 0, 0, 0);

  if (now >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1);
  }

  return nextReset.getTime();
}

function getRotationSession(now = new Date()) {
  const resetBoundary = new Date(now);
  resetBoundary.setHours(RESET_HOUR, 0, 0, 0);

  if (now < resetBoundary) {
    resetBoundary.setDate(resetBoundary.getDate() - 1);
  }

  return resetBoundary.getTime();
}

function getSavedRotation(candidateCount) {
  try {
    const saved = localStorage.getItem(ROTATION_KEY);
    if (!saved) return null;

    const rotation = JSON.parse(saved);
    const currentSession = getRotationSession();

    if (
      rotation.session !== currentSession ||
      !Number.isInteger(rotation.index) ||
      rotation.index < 0 ||
      rotation.index >= candidateCount
    ) {
      localStorage.removeItem(ROTATION_KEY);
      return null;
    }

    return rotation;
  } catch {
    localStorage.removeItem(ROTATION_KEY);
    return null;
  }
}

export default function HeroBanner({
  movies = [],
  onMovieClick,
  onExploreClick,
  onSearchClick,
}) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const featured = useMemo(
    () => trendingMovies.filter((movie) => movie.backdrop_path),
    [trendingMovies],
  );

  const fallbackMovies = useMemo(
    () => movies.filter((movie) => movie.backdrop_path),
    [movies],
  );

  const candidates = featured.length > 0 ? featured : fallbackMovies;

  useEffect(() => {
    let cancelled = false;

    async function loadTrendingMovies() {
      try {
        const data = await tmdbApi.getTrendingMovies(1);

        if (!cancelled) {
          setTrendingMovies(data?.results ?? []);
        }
      } catch {
        if (!cancelled) {
          setTrendingMovies([]);
        }
      }
    }

    loadTrendingMovies();

    return () => {
      cancelled = true;
    };
  }, []);

 useEffect(() => {
  if (!candidates.length) return;

  let nextIndex = 0;

  if (candidates.length > 1) {
    do {
      nextIndex = Math.floor(Math.random() * candidates.length);
    } while (nextIndex === heroIndex);
  }

  setHeroIndex(nextIndex);

  try {
    localStorage.setItem(
      ROTATION_KEY,
      JSON.stringify({
        index: nextIndex,
        updatedAt: Date.now(),
      })
    );
  } catch {
    
  }
}, [candidates]);

  useEffect(() => {
    if (!candidates.length) return;

    const nextResetAt = getNextResetTime();
    const timeout = window.setTimeout(
      () => {
        try {
          localStorage.removeItem(ROTATION_KEY);
        } catch {
          // Ignore storage errors.
        }

        const currentSession = getRotationSession(new Date());
        const nextIndex =
          candidates.length > 1
            ? Math.floor(Math.random() * candidates.length)
            : 0;

        setHeroIndex(nextIndex);

        try {
          localStorage.setItem(
            ROTATION_KEY,
            JSON.stringify({
              index: nextIndex,
              session: currentSession,
              nextResetAt: getNextResetTime(),
            }),
          );
        } catch {
          // The banner still works when localStorage is unavailable.
        }
      },
      Math.max(0, nextResetAt - Date.now()),
    );

    return () => window.clearTimeout(timeout);
  }, [candidates, heroIndex]);

  const hero = candidates[heroIndex] ?? candidates[0];

  const imageUrl = (path, size = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

  useEffect(() => {
    setImageLoaded(false);
  }, [hero?.id, hero?.backdrop_path]);

  const featuredCards = candidates.slice(0, 4);

  return (
    <section className="relative mb-12 min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#111827] sm:min-h-[490px]">
      <div className="absolute inset-0 bg-[#161b22]" />
      {hero?.backdrop_path && (
        <img
          key={hero.id}
          src={imageUrl(hero.backdrop_path, "w1280")}
          alt=""
          loading="eager"
          fetchPriority="high"
          onLoad={() => setImageLoaded(true)}
          onError={(event) => {
            event.currentTarget.style.display = "none";
            setImageLoaded(false);
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/75 to-[#0d1117]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />

      <div className="relative z-10 grid min-h-[420px] items-center gap-8 p-7 sm:min-h-[490px] sm:p-12 lg:grid-cols-[1fr_0.9fr]">
        <div
          key={hero?.id ?? "hero-content"}
          className="max-w-2xl transition-opacity duration-700"
        >
          <span className="inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
            <Film size={17} className="mr-2" />
            Trending Today
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
            {hero?.title || "Movies worth watching."}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
            {hero?.overview
              ? `${hero.overview.slice(0, 180)}${
                  hero.overview.length > 180 ? "…" : ""
                }`
              : "Discover popular films, explore new stories, and find your next movie night favourite."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {hero && (
              <button
                type="button"
                onClick={() => onMovieClick?.(hero)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <Play size={18} fill="currentColor" />
                View Movie
              </button>
            )}

            <button
              type="button"
              onClick={onSearchClick ?? onExploreClick}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              <Search size={18} />
              Find a Movie
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-4 sm:gap-3">
          {featuredCards.map((movie, index) => (
            <button
              type="button"
              key={movie.id}
              onClick={() => onMovieClick?.(movie)}
              aria-label={`View ${movie.title || "movie"}`}
              className={`group relative overflow-hidden rounded-xl border border-white/15 bg-gray-900 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-red-400 ${
                index % 2 === 1 ? "sm:translate-y-5" : ""
              }`}
            >
              {movie.poster_path ? (
                <img
                  src={imageUrl(movie.poster_path)}
                  alt={movie.title || "Movie poster"}
                  loading="lazy"
                  className="aspect-[2/3] h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center text-gray-400">
                  <Film size={28} />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              <span className="absolute bottom-2 left-1 right-1 line-clamp-2 text-left text-[10px] font-semibold sm:text-xs">
                {movie.title || "Untitled"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
