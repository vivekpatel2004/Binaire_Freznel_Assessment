import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../auth/firebase";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";

export default function Signup({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "auth-input w-full rounded-xl py-3.5 pl-11 pr-12 text-sm outline-none transition-all duration-300 focus:border-rose-400/70 focus:ring-2 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      try {
        await updateProfile(credential.user, {
          displayName: cleanName,
        });
      } catch (profileError) {
        console.error("Profile update failed:", profileError);
      }

      const userData = {
        uid: credential.user.uid,
        name: cleanName,
        email: credential.user.email,
      };

      setPassword("");
      setConfirmPassword("");

      onSuccess?.(userData);
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "This email is already registered. Please log in.",
        "auth/invalid-email":
          "Please enter a valid email address.",
        "auth/weak-password":
          "Please choose a stronger password.",
        "auth/operation-not-allowed":
          "Enable Email/Password sign-in in Firebase Console.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
        "auth/too-many-requests":
          "Too many attempts. Please try again later.",
      };

      setError(
        messages[err.code] || "Signup failed. Please try again."
      );

      console.error("Firebase signup error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="signup-name"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Full name
        </label>

        <div className="group relative">
          <User
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-rose-400"
          />

          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
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
          htmlFor="signup-email"
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
            id="signup-email"
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
          htmlFor="signup-password"
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
            id="signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            minLength={8}
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

      <div>
        <label
          htmlFor="signup-confirm"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Confirm password
        </label>

        <div className="group relative">
          <Lock
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-rose-400"
          />

          <input
            id="signup-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError("");
            }}
            required
            disabled={loading}
            className={inputClass}
          />
        </div>
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
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-xs leading-5 text-gray-500">
        By creating an account, you agree to use CineScope responsibly.
      </p>
    </form>
  );
}