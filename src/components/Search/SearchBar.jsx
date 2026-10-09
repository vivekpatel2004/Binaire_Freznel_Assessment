
import { Search, X } from "lucide-react";

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search movies...",
}) {
  return (
    <div className="relative w-full">
      <Search
        size={20}
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
        className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-10 pr-10 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange?.("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
