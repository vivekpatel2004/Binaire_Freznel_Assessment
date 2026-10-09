
const STORAGE_KEY = "cinescope-movies-cache";

export function saveMovies(movies, query = "") {
  try {
    const cache = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    cache[query.trim().toLowerCase()] = {
      movies,
      savedAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    return true;
  } catch (error) {
    console.error("Unable to cache movies:", error);
    return false;
  }
}

export function getCachedMovies(query = "") {
  try {
    const cache = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return cache[query.trim().toLowerCase()]?.movies || [];
  } catch (error) {
    console.error("Unable to read cached movies:", error);
    return [];
  }
}

export function clearCachedMovies() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Unable to clear cached movies:", error);
  }
}
