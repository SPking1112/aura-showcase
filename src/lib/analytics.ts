const KEY = "portal_visits_v1";

type Visits = Record<string, number>;

export function loadVisits(): Visits {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function trackVisit(projectId: string) {
  const visits = loadVisits();
  visits[projectId] = (visits[projectId] ?? 0) + 1;
  try {
    localStorage.setItem(KEY, JSON.stringify(visits));
  } catch {
    /* ignore */
  }
}
