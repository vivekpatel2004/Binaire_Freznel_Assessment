
import { useEffect, useMemo, useState } from "react";
import { Film, Play, Search } from "lucide-react";
import tmdbApi from "../../api/TMDBApi";

const ROTATION_KEY = "cinescope-hero-rotation";
const DAILY_CACHE_KEY = "cinescope-hero-daily-movies";
const RESET_HOUR = 12;

const imageUrl = (path, size = "w500") => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
};

// Daily session changes at 12 PM local time.
function getRotationSession(now = new Date()) {
  const boundary = new Date(now);
  boundary.setHours(RESET_HOUR, 0, 0, 0);

  if (now < boundary) {
    boundary.setDate(boundary.getDate() - 1);
  }

  const year = boundary.getFullYear();
  const month = String(boundary.getMonth() + 1).padStart(2, "0");
  const day = String(boundary.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getNextResetTime(now = new Date()) {
  const next = new Date(now);
  next.setHours(RESET_HOUR, 0, 0, 0);

  if (now >= next) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime();
}

function readStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save hero cache:", error);
  }
}

function getCachedMovies() {
  const cached = readStorage(DAILY_CACHE_KEY);

  return Array.isArray(cached?.results) ? cached.results : [];
}

function getSavedMovie(session, candidates) {
  const saved = readStorage(ROTATION_KEY);

  if (
    !saved ||
    saved.session !== session ||
    !Array.isArray(candidates)
  ) {
    return null;
  }

  return (
    candidates.find(
      (movie) => String(movie.id) === String(saved.movieId)
    ) ?? null
  );
}

function chooseDailyMovie(candidates, session) {
  if (!candidates.length) return null;

  const savedMovie = getSavedMovie(session, candidates);

  if (savedMovie) {
    return savedMovie;
  }

  const index = Math.floor(Math.random() * candidates.length);
  const selectedMovie = candidates[index];

  writeStorage(ROTATION_KEY, {
    movieId: selectedMovie.id,
    session,
  });

  return selectedMovie;
}

function saveDailyMovies(results, session) {
  writeStorage(DAILY_CACHE_KEY, {
    session,
    results,
    savedAt: Date.now(),
  });
}

export default function HeroBanner({
  movies = [],
  onMovieClick,
  onExploreClick,
  onSearchClick,
}) {
  const [trendingMovies, setTrendingMovies] = useState(
    () => getCachedMovies()
  );

  const [dailyMovie, setDailyMovie] = useState(() => {
    const cached = getCachedMovies();
    return getSavedMovie(getRotationSession(), cached);
  });

  const featured = useMemo(() => {
    return trendingMovies.filter(
      (movie) => movie?.backdrop_path
    );
  }, [trendingMovies]);

  const fallbackMovies = useMemo(() => {
    return movies.filter(
      (movie) => movie?.backdrop_path
    );
  }, [movies]);

  const candidates =
    featured.length > 0 ? featured : fallbackMovies;

  // Fetch once per daily session and reuse the saved snapshot
  // on refresh.
  useEffect(() => {
    let cancelled = false;
    let resetTimeout;

    async function loadDailyMovies(forceRefresh = false) {
      const session = getRotationSession();
      const cached = readStorage(DAILY_CACHE_KEY);

      if (
        !forceRefresh &&
        cached?.session === session &&
        Array.isArray(cached.results) &&
        cached.results.length > 0
      ) {
        if (cancelled) return;

        setTrendingMovies(cached.results);

        const eligibleMovies = cached.results.filter(
          (movie) => movie?.backdrop_path
        );

        setDailyMovie(
          chooseDailyMovie(eligibleMovies, session)
        );

        return;
      }

      try {
        const data = await tmdbApi.getTrendingMovies(1);

        if (cancelled) return;

        const results = Array.isArray(data?.results)
          ? data.results.filter(Boolean)
          : [];

        if (results.length > 0) {
          saveDailyMovies(results, session);
          setTrendingMovies(results);

          const eligibleMovies = results.filter(
            (movie) => movie?.backdrop_path
          );

          setDailyMovie(
            chooseDailyMovie(eligibleMovies, session)
          );
        } else {
          const previousMovies = getCachedMovies();

          if (previousMovies.length > 0) {
            setTrendingMovies(previousMovies);
          }
        }
      } catch (error) {
        console.error("Failed to fetch trending movies:", error);

        if (cancelled) return;

        const previousMovies = getCachedMovies();

        if (previousMovies.length > 0) {
          setTrendingMovies(previousMovies);
        }
      }
    }

    function scheduleNextReset() {
      resetTimeout = window.setTimeout(async () => {
        try {
          localStorage.removeItem(DAILY_CACHE_KEY);
          localStorage.removeItem(ROTATION_KEY);
        } catch {
          // The component can work without localStorage.
        }

        if (cancelled) return;

        await loadDailyMovies(true);

        if (!cancelled) {
          scheduleNextReset();
        }
      }, Math.max(0, getNextResetTime() - Date.now()));
    }

    loadDailyMovies();
    scheduleNextReset();

    return () => {
      cancelled = true;
      window.clearTimeout(resetTimeout);
    };
  }, []);

  // Use supplied movies if the trending API is unavailable.
  useEffect(() => {
    if (!candidates.length) {
      setDailyMovie(null);
      return;
    }

    const session = getRotationSession();

    setDailyMovie((currentMovie) => {
      const existingMovie = candidates.find(
        (movie) =>
          String(movie.id) === String(currentMovie?.id)
      );

      if (existingMovie) {
        return existingMovie;
      }

      return chooseDailyMovie(candidates, session);
    });
  }, [candidates]);

  const hero =
    candidates.find(
      (movie) => String(movie.id) === String(dailyMovie?.id)
    ) ??
    dailyMovie ??
    candidates[0] ??
    null;

  const featuredCards = candidates.slice(0, 4);

  return (
    <section className="relative mb-12 min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#111827] sm:min-h-[490px]">
      {/* Background fallback */}
      <div className="absolute inset-0 bg-[#161b22]" />

      {/* Background image: visibility does not depend on React state */}
      {hero?.backdrop_path && (
        <img
          key={`${hero.id}-${hero.backdrop_path}`}
          src={imageUrl(hero.backdrop_path, "w1280")}
          alt=""
          loading="eager"
          fetchPriority="high"
          onError={(event) => {
            console.error(
              "Hero background image failed:",
              event.currentTarget.src
            );
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
      )}

      {/* Image overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/75 to-[#0d1117]/20" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />

      <div className="relative z-10 grid min-h-[420px] items-center gap-8 p-7 sm:min-h-[490px] sm:p-12 lg:grid-cols-[1fr_0.9fr]">
        {/* Hero movie information */}
        <div
          key={hero?.id ?? "hero-content"}
          className="max-w-2xl"
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
