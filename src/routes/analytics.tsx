import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { loadProjects, type Project } from "@/lib/projects";
import { loadVisits } from "@/lib/analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SPking" },
      { name: "description", content: "Project visit analytics." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [visits, setVisits] = useState<Record<string, number>>({});

  useEffect(() => {
    setProjects(loadProjects());
    setVisits(loadVisits());
  }, []);

  const rows = useMemo(() => {
    return projects
      .map((p) => ({ ...p, count: visits[p.id] ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [projects, visits]);

  const max = Math.max(1, ...rows.map((r) => r.count));
  const total = rows.reduce((s, r) => s + r.count, 0);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <AppShell title="Analytics">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Projects" value={projects.length} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard label="Total visits" value={total} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard
          label="Top project"
          value={rows[0]?.count ?? 0}
          sub={rows[0]?.title ?? "—"}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {rows.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="font-display text-lg font-bold">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add projects from the Admin page to start tracking visits.
          </p>
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-3xl">
          <div className="border-b border-border/60 px-6 py-4">
            <h2 className="font-display font-bold">Visits per project</h2>
            <p className="text-xs text-muted-foreground">Counted on every Live Demo click.</p>
          </div>
          <ul className="divide-y divide-border/40">
            {rows.map((r) => (
              <li key={r.id} className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.count === 0 ? "0 visits" : `${r.count} visit${r.count === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <span className="font-display text-lg font-bold tabular-nums">{r.count}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="gradient-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${(r.count / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground shadow-glow">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-1 truncate text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
