
import { useEffect, useState } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./auth/firebase";

import Navbar from "./components/Layout/Navbar";
import HeroBanner from "./components/Layout/HeroBanner";
import MovieGrid from "./components/Layout/MovieGrid";
import Footer from "./components/Layout/Footer";
import SearchBar from "./components/Search/SearchBar";
import GenreFilter from "./components/Filters/GenreFilter";
import SortDropdown from "./components/Sorting/SortDropdown";
import MovieModal from "./components/Models/MovieModal";
import Auth from "./components/Auth/Auth";

import useOnlineStatus from "./hooks/useOnlineStatus";
import useDebounce from "./hooks/useDebounce";
import { searchMovies } from "./search/movieSearch";
import { filterMoviesByGenre } from "./filters/genreFilter";
import { sortMovies } from "./sorting/movieSorting";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("popularity");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [moreError, setMoreError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const online = useOnlineStatus();
  const debouncedQuery = useDebounce(query.trim(), 400);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch movies when search changes.
  useEffect(() => {
    let cancelled = false;

    async function fetchMovies() {
      setLoading(true);
      setError("");
      setMoreError("");
      setPage(1);
      setTotalPages(1);
      setMovies([]);

      try {
        const data = await searchMovies(debouncedQuery, 1);

        if (cancelled) return;

        setMovies(data.results ?? []);
        setTotalPages(Math.min(data.total_pages ?? 1, 500));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load movies.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, retryCount]);

  // Load more movies.
  async function loadMore() {
    if (
      loading ||
      loadingMore ||
      !online ||
      page >= totalPages
    ) {
      return;
    }

    setLoadingMore(true);
    setMoreError("");

    try {
      const nextPage = page + 1;
      const data = await searchMovies(debouncedQuery, nextPage);

      const newMovies = data.results ?? [];

      setMovies((previous) => {
        const ids = new Set(previous.map((movie) => movie.id));

        return [
          ...previous,
          ...newMovies.filter((movie) => !ids.has(movie.id)),
        ];
      });

      setPage(nextPage);
      setTotalPages(Math.min(data.total_pages ?? totalPages, 500));
    } catch (err) {
      setMoreError(
        !navigator.onLine
          ? "You are offline. Reconnect and try again."
          : err?.message || "Unable to load more movies."
      );
    } finally {
      setLoadingMore(false);
    }
  }

  // Logout from Firebase.
  async function handleLogout() {
    try {
      await signOut(auth);
      setShowAuth(false);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  }

  // Home and movie navigation.
  function goHome() {
    setQuery("");
    setGenre("all");
    setSort("popularity");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToMovies() {
    document.getElementById("movie-library")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  const visibleMovies = sortMovies(
    filterMoviesByGenre(movies, genre),
    sort
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Navbar
        online={online}
        onHomeClick={goHome}
        onSignupClick={() => setShowAuth(true)}
        currentUser={currentUser}
        authLoading={authLoading}
        onLogout={handleLogout}
      >
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search movies..."
        />
      </Navbar>

      <main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10">
        <HeroBanner
          movies={movies}
          onMovieClick={setSelectedMovie}
          onExploreClick={scrollToMovies}
          onSearchClick={scrollToMovies}
        />

        <section id="movie-library" className="mt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                Movie collection
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {debouncedQuery ? "Search Results" : "Popular Movies"}
              </h2>
            </div>

            <SortDropdown value={sort} onChange={setSort} />
          </div>

          <div className="mb-7">
            <GenreFilter
              selectedGenre={genre}
              onGenreChange={setGenre}
            />
          </div>

          {error && movies.length === 0 ? (
            <div
              className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6"
              role="alert"
            >
              <h3 className="font-semibold text-red-300">
                Unable to load movies
              </h3>

              <p className="mt-2 text-sm text-gray-300">{error}</p>

              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="mt-4 rounded-lg bg-red-500 px-4 py-2 font-semibold hover:bg-red-400"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {error && (
                <p className="mb-4 text-sm text-amber-300" role="status">
                  Could not refresh movies.
                </p>
              )}

              <MovieGrid
                movies={visibleMovies}
                loading={loading && movies.length === 0}
                onMovieClick={setSelectedMovie}
              />
            </>
          )}

          {!loading && !error && visibleMovies.length === 0 && (
            <p className="py-8 text-center text-gray-400">
              No movies found. Try another search or genre.
            </p>
          )}

          {moreError && (
            <p className="mt-4 text-center text-sm text-red-300" role="status">
              {moreError}
            </p>
          )}

          {page < totalPages && movies.length > 0 && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore || loading || !online}
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold transition hover:border-red-400 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More Movies"}
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      
      {showAuth && (
        <div
         className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowAuth(false);
            }
          }}
        >
          <div className="w-full max-w-md">
            <Auth
              onLogin={() => setShowAuth(false)}
              onClose={() => setShowAuth(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
