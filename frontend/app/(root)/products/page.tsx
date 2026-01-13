"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchProducts, Product } from "@/lib/api/products";

export default function ProductsPage() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Loading books...</p>;
  if (error) return <p>Failed to load books</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data!.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="border rounded p-4 hover:shadow transition"
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-52 mx-auto object-contain"
            />
          )}

          <h2 className="font-bold mt-3">{product.title}</h2>
          <p className="text-sm text-gray-600">{product.author}</p>

          {product.price !== null && (
            <p className="font-bold mt-2">${product.price}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
