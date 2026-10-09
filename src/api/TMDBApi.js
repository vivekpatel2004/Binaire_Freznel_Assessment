const API_BASE_URL = "https://api.themoviedb.org/3";
const CACHE_PREFIX = "cinescope-cache:";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

class TMDBApi {
  constructor() {
    this.apiKey = import.meta.env.VITE_TMDB_API_KEY;
    this.accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  }

  getCacheKey(endpoint, params = {}) {
    const query = new URLSearchParams();

    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.set(key, String(value));
        }
      });

    return `${CACHE_PREFIX}${endpoint}?${query.toString()}`;
  }

  getTrendingMovies(page = 1) {
    return this.request("/trending/movie/day", {
      language: "en-US",
      page,
    });
  }

  readCache(key) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;

      const entry = JSON.parse(saved);

      if (!entry || entry.data == null || !entry.savedAt) {
        localStorage.removeItem(key);
        return null;
      }

      return {
        ...entry,
        isExpired: Date.now() - entry.savedAt > CACHE_DURATION,
      };
    } catch {
      return null;
    }
  }

  saveCache(key, data) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          data,
          savedAt: Date.now(),
        }),
      );
    } catch (error) {
      console.warn("Unable to save API cache:", error);
    }
  }

  async request(endpoint, params = {}) {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.readCache(cacheKey);

    if (!navigator.onLine) {
      if (cached) return cached.data;

      if (endpoint === "/search/movie") {
        const popularKey = this.getCacheKey("/movie/popular", {
          language: "en-US",
          page: 1,
        });

        const popularCache = this.readCache(popularKey);
        if (popularCache) return popularCache.data;
      }

      throw new Error(
        "No saved movies are available yet. Connect to the internet once to cache movies for offline use.",
      );
    }

    if (!this.apiKey && !this.accessToken) {
      if (cached) return cached.data;
      throw new Error("TMDB API credentials are missing in .env");
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (this.apiKey) {
      url.searchParams.set("api_key", this.apiKey);
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });

    try {
      const response = await fetch(url, {
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      });

      if (!response.ok) {
        throw new Error(`TMDB request failed: ${response.status}`);
      }

      const data = await response.json();
      this.saveCache(cacheKey, data);

      return data;
    } catch (error) {
      if (cached) return cached.data;

      if (endpoint === "/search/movie") {
        const popularKey = this.getCacheKey("/movie/popular", {
          language: "en-US",
          page: 1,
        });

        const popularCache = this.readCache(popularKey);
        if (popularCache) return popularCache.data;
      }

      throw error;
    }
  }

  getPopularMovies(page = 1) {
    return this.request("/movie/popular", {
      language: "en-US",
      page,
    });
  }

  searchMovies(query, page = 1) {
    return this.request("/search/movie", {
      query,
      language: "en-US",
      page,
      include_adult: false,
    });
  }

  getMovieDetails(movieId) {
    return this.request(`/movie/${movieId}`, {
      language: "en-US",
    });
  }

  getImageUrl(path, size = "w500") {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
  }
}

const tmdbApi = new TMDBApi();

export default tmdbApi;
