import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, LogIn, LogOut, User, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

export function Topbar({ onMenu, title }: { onMenu: () => void; title: string }) {
  const { isAuthenticated, username, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="glass sticky top-4 z-20 mx-4 mb-6 flex items-center justify-between rounded-2xl px-4 py-3 lg:mx-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-foreground hover:bg-white/40 lg:hidden dark:hover:bg-white/5"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold leading-tight sm:text-xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-foreground transition-smooth hover:shadow-soft dark:bg-white/10"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full bg-white/50 p-1 pr-3 backdrop-blur transition-smooth hover:shadow-soft dark:bg-white/10"
          >
            <span className="gradient-primary flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground">
              <User className="h-4 w-4" />
            </span>
            <span className="hidden text-sm font-medium sm:inline">
              {isAuthenticated ? username : "Guest"}
            </span>
          </button>

          {open && (
            <div className="glass-strong animate-fade-in-up absolute right-0 mt-2 w-56 rounded-2xl p-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="font-semibold">{username}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      toast.success("Logged out");
                      navigate({ to: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-smooth hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/40 dark:hover:bg-white/5"
                >
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
