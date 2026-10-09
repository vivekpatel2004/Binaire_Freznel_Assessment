import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../auth/firebase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";

export default function Login({ onLogin, onSignup, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "auth-input w-full rounded-xl py-3.5 pl-11 pr-12 text-sm outline-none transition-all duration-300 focus:border-rose-400/70 focus:ring-2 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = credential.user;

      await onLogin?.({
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
      });
    } catch (err) {
      const messages = {
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/user-not-found": "No account found. Please sign up.",
        "auth/wrong-password": "Incorrect email or password.",
        "auth/too-many-requests":
          "Too many attempts. Please try again later.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
        "auth/user-disabled": "This account has been disabled.",
      };

      setError(
        messages[err.code] || "Login failed. Please try again."
      );

      console.error("Firebase login error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Email address
        </label>

        <div className="group relative">
          <Mail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-rose-400"
          />

          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            required
            disabled={loading}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Password
        </label>

        <div className="group relative">
          <Lock
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-rose-400"
          />

          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            required
            disabled={loading}
            className={inputClass}
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors duration-200 hover:text-rose-300 disabled:opacity-50"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-rose-300 transition-colors duration-200 hover:text-rose-200 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm leading-5 text-red-300"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-rose-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {loading ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Logging in...
          </>
        ) : (
          "Log In"
        )}
      </button>

      <p className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSignup}
          className="font-semibold text-rose-300 transition-colors duration-200 hover:text-rose-200 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}