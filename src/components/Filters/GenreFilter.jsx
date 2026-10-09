
import { GENRES } from "../../filters/genreFilter";

export default function GenreFilter({
  selectedGenre = "all",
  onGenreChange,
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter movies by genre"
    >
      {GENRES.map((genre) => {
        const isSelected =
          String(selectedGenre) === String(genre.id);

        return (
          <button
            key={genre.id}
            type="button"
            onClick={() => onGenreChange?.(genre.id)}
            aria-pressed={isSelected}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
              isSelected
                ? "bg-blue-600 text-white"
                : "border border-gray-700 bg-gray-900 text-gray-300 hover:border-blue-500 hover:text-white"
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
