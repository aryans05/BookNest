const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

/* =====================
   TYPES
===================== */

export type Product = {
  id: number;
  title: string;
  author: string | null;
  price: number | null;
  currency: string | null;
  imageUrl: string | null;
  sourceUrl: string;
  categoryId: number;
};

export type ProductDetails = {
  description: string | null;
  specs: any | null;
  editorialReviews: any | null;
  recommendedProducts: any | null;
  ratingsAvg: number | null;
  reviewsCount: number;
};

export type PaginatedProducts = {
  page: number;
  limit: number;
  total: number;
  products: Product[];
};

/* =====================
   INTERNAL FETCH HELPER
===================== */

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/* =====================
   API CALLS
===================== */

// 🔹 Product list (lightweight)
export function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>(`${API_BASE_URL}/products`);
}

// 🔹 SINGLE PRODUCT (🔥 REQUIRED FOR DETAIL PAGE)
export function fetchProductById(productId: number): Promise<Product> {
  return apiFetch<Product>(`${API_BASE_URL}/products/${productId}`);
}

// 🔹 Products by category (paginated)
export function getProductsByCategory(
  categoryId: number,
  page = 1,
  limit = 15
): Promise<PaginatedProducts> {
  return apiFetch<PaginatedProducts>(
    `${API_BASE_URL}/products/category/${categoryId}?page=${page}&limit=${limit}`
  );
}

// 🔹 Product details (heavy)
export function fetchProductDetails(
  productId: number
): Promise<ProductDetails | null> {
  return apiFetch<ProductDetails | null>(
    `${API_BASE_URL}/products/${productId}/details`
  );
}

// 🔹 Refresh category products (SCRAPE)
export async function refreshCategoryProducts(
  categoryId: number,
  collectionUrl: string,
  limit = 15
) {
  const res = await fetch(
    `${API_BASE_URL}/products/scrape/full/${categoryId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectionUrl, limit }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to refresh category products");
  }

  return res.json();
}

/* =====================
   🔥 HOME PAGE (RANDOM)
===================== */

export async function fetchRandomProducts(limit = 5): Promise<Product[]> {
  const products = await fetchProducts();

  if (!products.length) return [];

  return products.sort(() => 0.5 - Math.random()).slice(0, limit);
}
