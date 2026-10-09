import { useState } from "react";
import { Film, X } from "lucide-react";

import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";

export default function Auth({ onLogin, onClose }) {
  const [mode, setMode] = useState("login");
  const [notice, setNotice] = useState("");

  function changeMode(nextMode) {
    setNotice("");
    setMode(nextMode);
  }

  function handleSignupSuccess() {
    setNotice("Account created successfully. Please log in.");
    setMode("login");
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-red-400/20 bg-[#111318]/85 p-6 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-400">
              <Film size={25} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Cine <span className="text-red-400">Scope</span>
              </h2>
              <p className="text-xs text-gray-400">
                {mode === "login"
                  ? "Welcome back"
                  : mode === "signup"
                  ? "Create your account"
                  : "Reset your password"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication"
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 flex rounded-xl border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => changeMode("login")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => changeMode("signup")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "signup"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {notice && (
          <p
            className="auth-glass-enter relative overflow-hidden rounded-3xl border border-rose-300/20 bg-[#17151B]/85 p-6 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8"
            role="status"
          >
            {notice}
          </p>
        )}

        {mode === "login" ? (
          <Login
            onLogin={onLogin}
            onSignup={() => changeMode("signup")}
            onForgotPassword={() => changeMode("forgot")}
          />
        ) : mode === "signup" ? (
          <Signup onSuccess={handleSignupSuccess} />
        ) : (
          <ForgotPassword onBack={() => changeMode("login")} />
        )}
      </div>
    </div>
  );
}
