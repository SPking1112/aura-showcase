import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Github, Search, FolderOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SmartImage } from "@/components/SmartImage";
import { loadProjects, isValidUrl, type Project } from "@/lib/projects";
import { trackVisit } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Projects — LumenFolio" },
      {
        name: "description",
        content: "Explore featured SaaS projects with live demos and source code.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setProjects(loadProjects());
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)),
    );
  }, [projects, query]);

  return (
    <AppShell title="Projects">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} Project{filtered.length === 1 ? "" : "s"}
          {query && projects.length !== filtered.length ? ` of ${projects.length}` : ""}
        </p>
        <div className="glass relative flex items-center rounded-2xl px-4 py-2 sm:w-80">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tech…"
            className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass h-80 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasProjects={projects.length > 0} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const liveOk = isValidUrl(project.liveUrl);
  const ghOk = isValidUrl(project.githubUrl);

  return (
    <article
      className="glass animate-fade-in-up group flex flex-col overflow-hidden rounded-3xl transition-smooth hover:-translate-y-1.5 hover:shadow-lift"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{project.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <ActionButton
            href={project.liveUrl}
            enabled={liveOk}
            label="Live Demo"
            icon={<ExternalLink className="h-3.5 w-3.5" />}
            primary
          />
          <ActionButton
            href={project.githubUrl}
            enabled={ghOk}
            label="GitHub"
            icon={<Github className="h-3.5 w-3.5" />}
          />
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  href,
  enabled,
  label,
  icon,
  primary,
}: {
  href: string;
  enabled: boolean;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  const base =
    "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-smooth";
  if (!enabled) {
    return (
      <span
        title="Invalid or missing URL"
        className={`${base} cursor-not-allowed bg-muted text-muted-foreground opacity-60`}
      >
        {icon} {label}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary
          ? `${base} gradient-primary text-primary-foreground hover:shadow-glow`
          : `${base} bg-white/60 text-foreground hover:bg-white dark:bg-white/10 dark:hover:bg-white/15`
      }
    >
      {icon} {label}
    </a>
  );
}

function EmptyState({ hasProjects }: { hasProjects: boolean }) {
  return (
    <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
      <div className="gradient-accent mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow">
        <FolderOpen className="h-7 w-7 text-primary-foreground" />
      </div>
      <h3 className="font-display text-xl font-bold">
        {hasProjects ? "No matches found" : "No projects yet"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {hasProjects
          ? "Try a different search term."
          : "Sign in as admin to add your first project."}
      </p>
      {!hasProjects && (
        <Link
          to="/login"
          className="gradient-primary mt-6 rounded-2xl px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Go to login
        </Link>
      )}
    </div>
  );
}
