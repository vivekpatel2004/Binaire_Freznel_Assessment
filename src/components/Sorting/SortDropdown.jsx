
import { ArrowDownUp } from "lucide-react";

export default function SortDropdown({
  value = "popularity",
  onChange,
}) {
  return (
    <div className="flex items-center gap-3">
      <ArrowDownUp
        size={18}
        className="shrink-0 text-gray-400"
        aria-hidden="true"
      />

      <label htmlFor="movie-sort" className="sr-only">
        Sort movies by
      </label>

      <select
        id="movie-sort"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="cursor-pointer rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none transition hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      >
        <option value="popularity">Most Popular</option>
        <option value="rating">Top Rated</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
}
