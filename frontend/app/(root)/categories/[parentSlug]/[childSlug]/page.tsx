"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCategoryBySlug } from "@/lib/api/navigaion";
import {
  getProductsByCategory,
  refreshCategoryProducts,
  PaginatedProducts,
} from "@/lib/api/products";
import type { Category } from "@/lib/api/navigaion";

const PAGE_SIZE = 15;

const COLLECTION_URL_MAP: Record<string, string> = {
  "rare-books": "https://www.worldofbooks.com/en-gb/collections/rare-books",

  "first-editions":
    "https://www.worldofbooks.com/en-gb/collections/first-editions",
};

export default function CategoryProductsPage() {
  const params = useParams();

  const childSlug = Array.isArray(params.childSlug)
    ? params.childSlug[0]
    : params.childSlug;

  const [page, setPage] = useState(1);

  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery<Category>({
    queryKey: ["category", childSlug],
    queryFn: () => fetchCategoryBySlug(childSlug),
    enabled: !!childSlug,
  });

  const categoryId = category?.id;
  const collectionUrl = category
    ? COLLECTION_URL_MAP[category.slug]
    : undefined;

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    refetch,
    isFetching,
  } = useQuery<PaginatedProducts>({
    queryKey: ["products", categoryId, page],
    queryFn: () => getProductsByCategory(categoryId as number, page, PAGE_SIZE),
    enabled: typeof categoryId === "number",
    keepPreviousData: true,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!categoryId || !collectionUrl) {
        throw new Error("Collection URL not configured for this category");
      }

      return refreshCategoryProducts(categoryId, collectionUrl, PAGE_SIZE);
    },
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (categoryLoading || productsLoading) {
    return <p className="p-10">Loading details...</p>;
  }

  if (categoryError || productsError) {
    return (
      <p className="p-10 text-red-500">Failed to load category or products</p>
    );
  }

  if (!category) {
    return <p className="p-10">Category not found</p>;
  }

  if (!products || products.products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">{category.title}</h1>
        <p>No products found in this category.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(products.total / PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{category.title}</h1>

        <button
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending || !collectionUrl}
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          {refreshMutation.isPending ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-4 hover:shadow block"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-48 w-full object-cover mb-3"
              />
            )}

            <h3 className="font-semibold line-clamp-2">{product.title}</h3>

            {product.price !== null && (
              <p className="font-bold mt-1">${product.price}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
