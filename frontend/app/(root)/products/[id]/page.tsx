"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProductById,
  fetchProductDetails,
  Product,
  ProductDetails,
} from "@/lib/api/products";
import SpecsTable from "@/components/SpecsTable";
import EditorialReviews from "@/components/EditorialReviews";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  /* =====================
     BASIC PRODUCT (ALWAYS FETCH)
  ===================== */
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: Number.isFinite(productId),
  });

  /* =====================
     PRODUCT DETAILS (HEAVY)
  ===================== */
  const { data: details, isLoading: detailsLoading } =
    useQuery<ProductDetails | null>({
      queryKey: ["product-details", productId],
      queryFn: () => fetchProductDetails(productId),
      enabled: !!product,
    });

  /* =====================
     STATES
  ===================== */
  if (!Number.isFinite(productId)) {
    return <p className="text-center mt-20">Invalid product</p>;
  }

  if (productLoading) {
    return <p className="text-center mt-20">Loading product...</p>;
  }

  if (productError || !product) {
    return <p className="text-center mt-20">Product not found</p>;
  }

  /* =====================
     UI
  ===================== */
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-14">
      {/* PRODUCT HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {product.imageUrl && (
          <div className="flex justify-center">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full max-w-sm h-[460px] object-contain"
            />
          </div>
        )}

        <div>
          <h1 className="text-4xl font-bold leading-tight">{product.title}</h1>

          {product.author && (
            <p className="text-lg text-gray-600 mt-3">by {product.author}</p>
          )}

          {product.price !== null && (
            <p className="text-3xl font-bold mt-6">${product.price}</p>
          )}

          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            View on World of Books
          </a>
        </div>
      </div>

      {/* DESCRIPTION */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Description</h2>

        <p className="text-gray-700 leading-relaxed">
          {detailsLoading
            ? "Loading description..."
            : details?.description || "Description coming soon."}
        </p>
      </section>

      {/* SPECS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Specifications</h2>

        {details?.specs ? (
          <SpecsTable specs={details.specs} />
        ) : (
          <p className="text-gray-500">Specifications coming soon.</p>
        )}
      </section>

      {/* EDITORIAL REVIEWS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Editorial Reviews</h2>

        {details?.editorialReviews ? (
          <EditorialReviews reviews={details.editorialReviews} />
        ) : (
          <p className="text-gray-500">No editorial reviews yet.</p>
        )}
      </section>
    </div>
  );
}
