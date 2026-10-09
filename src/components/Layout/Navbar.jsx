import { useState } from "react";
import { Film, Menu, X, Wifi, WifiOff } from "lucide-react";
export default function Navbar({
  online,
  onHomeClick,
  onSignupClick,
  currentUser,
  authLoading,
  onLogout,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4 lg:px-10">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex shrink-0 items-center gap-2 text-xl font-bold"
          aria-label="CineScope home"
        >
          <Film className="text-red-500" size={28} />
          Cine<span className="text-red-500">Scope</span>
        </button>

        <div className="hidden max-w-xl flex-1 md:block">{children}</div>

        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-2 text-sm sm:flex"
            role="status"
            aria-live="polite"
          >
            {online ? (
              <Wifi size={18} className="text-green-400" />
            ) : (
              <WifiOff size={18} className="text-red-400" />
            )}

            <span className={online ? "text-green-400" : "text-red-400"}>
              {online ? "Online" : "Offline"}
            </span>
          </div>

          {authLoading ? null : currentUser ? (
            <div className="flex items-center gap-3">
              <span className="max-w-32 truncate text-sm font-semibold text-white">
                {currentUser.displayName || "User"}
              </span>

              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-red-300/30 bg-red-400/15 px-4 py-2 text-sm font-semibold text-red-100 backdrop-blur-md transition hover:bg-red-400/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignupClick}
              className="rounded-xl bg-red-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-300"
            >
              Login
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 hover:bg-white/10 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="space-y-4 border-t border-white/10 p-5 md:hidden">
          {children}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onSignupClick?.();
            }}
            className="w-full rounded-full bg-red-600 px-4 py-3 font-semibold"
          >
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
}
