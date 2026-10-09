import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../auth/firebase";
import { Mail, CheckCircle, ArrowLeft, LoaderCircle } from "lucide-react";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setSuccess(
        "If an account exists for this email, a password reset link has been sent. Please check your inbox."
      );
      setEmail("");
    } catch (err) {
      const messages = {
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/too-many-requests":
          "Too many attempts. Please try again later.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
        "auth/operation-not-allowed":
          "Enable Email/Password sign-in in Firebase Console.",
      };

      setError(
        messages[err.code] ||
          "Unable to send the reset email. Please try again."
      );

      console.error("Password reset error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6">
        <h3 className="text-2xl font-bold tracking-tight text-white">
          Forgot your password?
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-400">
          No worries. Enter your email and we’ll send you a link to reset
          your password.
        </p>
      </div>

      <div>
        <label
          htmlFor="forgot-email"
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
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setSuccess("");
            }}
            required
            disabled={loading}
            className="auth-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-rose-400/70 focus:ring-2 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm leading-6 text-rose-200"
        >
          <CheckCircle
            size={19}
            className="mt-0.5 shrink-0 text-rose-400"
          />
          <span>{success}</span>
        </div>
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
            Sending reset link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        Back to Login
      </button>
    </form>
  );
}