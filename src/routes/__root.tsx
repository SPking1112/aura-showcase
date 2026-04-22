import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LumenFolio — SaaS Project Portal" },
      {
        name: "description",
        content:
          "A modern SaaS-style project portfolio with glassmorphism UI, smooth animations, and a beautiful 3D login experience.",
      },
      { property: "og:title", content: "LumenFolio — SaaS Project Portal" },
      {
        property: "og:description",
        content: "A modern SaaS-style project portfolio with glassmorphism UI.",
      },
      { property: "og:type", content: "website" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-10 text-center">
        <h1 className="font-display gradient-text text-7xl font-bold">404</h1>
        <p className="mt-4 text-lg font-semibold">Page not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This page drifted off into the clouds.
        </p>
        <a
          href="/"
          className="gradient-primary mt-6 inline-flex rounded-2xl px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Back home
        </a>
      </div>
    </div>
  );
}
