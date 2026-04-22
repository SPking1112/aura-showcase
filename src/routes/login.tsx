import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Background } from "@/components/Background";
import loginArt from "@/assets/login-3d.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LumenFolio" },
      { name: "description", content: "Sign in to manage your project portfolio." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate({ to: "/admin" });
  }

  const handleTilt = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };
  const resetTilt = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(1000px) rotateY(0) rotateX(0)";
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!username.trim()) next.username = "Username is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back!");
      navigate({ to: "/admin" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <Background />

      <Link
        to="/"
        className="glass absolute top-4 left-4 z-10 flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-smooth hover:shadow-soft"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div
        ref={cardRef}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        className="glass-strong animate-fade-in-up grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2rem] transition-transform duration-300 ease-out md:grid-cols-2"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Illustration */}
        <div className="relative hidden flex-col items-center justify-center p-8 md:flex">
          <div
            className="absolute inset-6 rounded-[1.75rem]"
            style={{ background: "var(--gradient-accent)", opacity: 0.25, filter: "blur(40px)" }}
          />
          <img
            src={loginArt}
            alt="Friendly 3D character with a laptop"
            width={520}
            height={520}
            className="relative z-10 w-full max-w-md drop-shadow-2xl"
            style={{ transform: "translateZ(40px)" }}
          />
          <div className="relative z-10 mt-2 text-center">
            <h2 className="font-display text-2xl font-bold">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your projects with style.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-2">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-2xl shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">
              Lumen<span className="gradient-text">Folio</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold">Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">Unlock your dashboard.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field
              label="Username"
              error={errors.username}
              input={
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                />
              }
            />

            <Field
              label="Password"
              error={errors.password}
              input={
                <div className="flex w-full items-center gap-2">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    autoComplete="current-password"
                    className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              }
            />

            {errors.form && (
              <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:translate-y-[-2px] disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground/80">
        {label}
      </label>
      <div
        className={`glass flex items-center rounded-2xl px-4 py-3 transition-smooth focus-within:shadow-glow focus-within:ring-2 focus-within:ring-primary/40 ${
          error ? "ring-2 ring-destructive/50" : ""
        }`}
      >
        {input}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
