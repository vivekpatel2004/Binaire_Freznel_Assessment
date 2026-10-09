import { Film, Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="mt-16 border-t border-white/10 bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-xl font-bold text-white focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <Film size={25} className="text-blue-500" />
              Cine<span className="text-blue-500">Scope</span>
            </a>

            <p className="mt-3 max-w-sm text-sm leading-6">
              Discover popular movies, explore new releases, and find your next
              movie-night favorite.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <a
              href="#home"
              className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              Home
            </a>

            <a
              href="#movies"
              className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              Movies
            </a>

            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              TMDB
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-1 text-sm">
            © {new Date().getFullYear()} CineScope. Made with
            <Heart size={14} className="mx-1 fill-red-500 text-red-500" />
            for movie lovers.
          </p>

          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm transition hover:border-blue-500 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            Back to top
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
