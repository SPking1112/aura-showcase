import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { SmartImage } from "@/components/SmartImage";
import { ImageInput } from "@/components/ImageInput";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useAuth } from "@/lib/auth";
import {
  loadProjects,
  saveProjects,
  isValidUrl,
  type Project,
} from "@/lib/projects";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — LumenFolio" },
      { name: "description", content: "Manage your project portfolio." },
    ],
  }),
  component: AdminPage,
});

type FormState = Omit<Project, "id">;
const EMPTY: FormState = {
  title: "",
  description: "",
  techStack: [],
  liveUrl: "",
  githubUrl: "",
  imageUrl: "",
};

function AdminPage() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const persist = (next: Project[]) => {
    setProjects(next);
    saveProjects(next);
  };

  const onSubmit = (data: FormState) => {
    if (editing) {
      const next = projects.map((p) => (p.id === editing.id ? { ...editing, ...data } : p));
      persist(next);
      toast.success("Project updated");
    } else {
      const newProject: Project = { id: crypto.randomUUID(), ...data };
      persist([newProject, ...projects]);
      toast.success("Project added");
    }
    setShowForm(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    persist(projects.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    toast.success("Project deleted");
  };

  return (
    <AppShell title="Admin Dashboard">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length === 1 ? "" : "s"} managed
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="gradient-primary flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="font-display text-lg font-bold">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click "Add Project" to create your first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="glass overflow-hidden rounded-3xl">
              <div className="aspect-[16/9] overflow-hidden">
                <SmartImage
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold transition-smooth hover:bg-white dark:bg-white/10 dark:hover:bg-white/15"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-destructive/15 px-3 py-2 text-xs font-semibold text-destructive transition-smooth hover:bg-destructive/25"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          initial={editing ?? EMPTY}
          isEdit={!!editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={onSubmit}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this project?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AppShell>
  );
}

function ProjectForm({
  initial,
  isEdit,
  onClose,
  onSubmit,
}: {
  initial: FormState;
  isEdit: boolean;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
}) {
  const [data, setData] = useState<FormState>({
    ...initial,
    techStack: initial.techStack ?? [],
  });
  const [techInput, setTechInput] = useState(data.techStack.join(", "));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!data.title.trim()) next.title = "Title is required";
    if (!data.description.trim()) next.description = "Description is required";
    const stack = techInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (stack.length === 0) next.techStack = "At least one tech is required";
    if (data.liveUrl && !isValidUrl(data.liveUrl)) next.liveUrl = "Invalid URL";
    if (data.githubUrl && !isValidUrl(data.githubUrl)) next.githubUrl = "Invalid URL";
    if (
      data.imageUrl &&
      !data.imageUrl.startsWith("data:") &&
      !isValidUrl(data.imageUrl)
    )
      next.imageUrl = "Invalid image URL";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({ ...data, techStack: stack });
  };

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handle}
        className="glass-strong animate-fade-in-up max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            {isEdit ? "Edit Project" : "New Project"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 hover:bg-white/40 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <FormField label="Title" error={errors.title}>
            <input
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </FormField>

          <FormField label="Description" error={errors.description}>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full resize-none bg-transparent outline-none"
            />
          </FormField>

          <FormField
            label="Tech Stack (comma separated)"
            error={errors.techStack}
          >
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="React, TypeScript, Tailwind"
              className="w-full bg-transparent outline-none"
            />
          </FormField>

          <FormField label="Live URL" error={errors.liveUrl}>
            <input
              value={data.liveUrl}
              onChange={(e) => update("liveUrl", e.target.value)}
              placeholder="https://…"
              className="w-full bg-transparent outline-none"
            />
          </FormField>

          <FormField label="GitHub URL" error={errors.githubUrl}>
            <input
              value={data.githubUrl}
              onChange={(e) => update("githubUrl", e.target.value)}
              placeholder="https://github.com/…"
              className="w-full bg-transparent outline-none"
            />
          </FormField>

          <ImageInput
            value={data.imageUrl}
            onChange={(v) => update("imageUrl", v)}
            error={errors.imageUrl}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-white/50 py-2.5 text-sm font-semibold transition-smooth hover:bg-white dark:bg-white/10 dark:hover:bg-white/15"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="gradient-primary flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Save className="h-4 w-4" /> {isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground/80">
        {label}
      </label>
      <div
        className={`glass rounded-2xl px-4 py-3 transition-smooth focus-within:ring-2 focus-within:ring-primary/40 ${
          error ? "ring-2 ring-destructive/50" : ""
        }`}
      >
        {children}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
