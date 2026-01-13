const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export type Navigation = {
  id: number;
  title: string;
  slug: string;
};

export type Category = {
  id: number;
  title: string;
  slug: string;
  navigationId?: number;
  sourceUrl?: string;
};

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${url}`);
  }

  return res.json() as Promise<T>;
}

export function fetchNavigations(): Promise<Navigation[]> {
  return apiFetch<Navigation[]>(`${API_BASE_URL}/navigations`);
}

export function fetchCategoriesByNavigation(
  navigationId: number
): Promise<Category[]> {
  return apiFetch<Category[]>(
    `${API_BASE_URL}/categories/by-navigation/${navigationId}`
  );
}

export function fetchCategoryBySlug(slug: string): Promise<Category> {
  return apiFetch<Category>(
    `${API_BASE_URL}/categories/slug/${encodeURIComponent(slug)}`
  );
}
