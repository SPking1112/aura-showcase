export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
};

const KEY = "portal_projects_v1";

const SEED: Project[] = [
  {
    id: "1",
    title: "Nimbus Analytics",
    description: "Real-time product analytics with beautiful dashboards and instant insights.",
    techStack: ["React", "TypeScript", "tRPC", "Postgres"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  },
  {
    id: "2",
    title: "Aurora Commerce",
    description: "Headless storefront kit with stunning glassmorphism components.",
    techStack: ["Next.js", "Stripe", "Tailwind"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
  },
  {
    id: "3",
    title: "PulseChat",
    description: "Secure team messaging with end-to-end encryption and threads.",
    techStack: ["React", "WebRTC", "Node"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80",
  },
];

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProjects(p: Project[]) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
