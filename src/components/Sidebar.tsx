import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Shield, Sparkles, X, BarChart3 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const loc = useLocation();
  const { isAuthenticated } = useAuth();

  const items = [
    { to: "/", label: "Projects", icon: LayoutGrid, requireAuth: false },
    { to: "/admin", label: "Admin", icon: Shield, requireAuth: true },
    { to: "/analytics", label: "Analytics", icon: BarChart3, requireAuth: true },
  ] as const;

  const visibleItems = items.filter((i) => !i.requireAuth || isAuthenticated);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass-strong flex h-full flex-col rounded-3xl p-6">
          <div className="mb-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-2xl shadow-glow">
  <img
  src={logo}
  alt="Logo"
  className="h-6 w-6 object-contain"
/>
</div>
              <span className="font-display text-xl font-bold tracking-tight">
                SPking
              </span>
            </Link>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {visibleItems.map(({ to, label, icon: Icon }) => {
              const active =
                to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-smooth ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* <div className="mt-auto">
            <div className="glass rounded-2xl p-4 text-xs text-muted-foreground">
              Crafted with care — toggle the theme from the top bar.
            </div>
          </div> */}
        </div>
      </aside>
    </>
  );
}
