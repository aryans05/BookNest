"use client";

import { useQuery } from "@tanstack/react-query";
import ProductList from "@/components/shared/product/product-list";
import { fetchRandomProducts, type Product } from "@/lib/api/products";

export default function HomeClient() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["home-random-products"],
    queryFn: () => fetchRandomProducts(5),
    staleTime: 60_000,
  });

  if (isLoading) {
    return <p className="p-10">Loading latest books...</p>;
  }

  if (isError || !products || products.length === 0) {
    return <p className="p-10">Failed to load products</p>;
  }

  return <ProductList title="Newest Arrivals" data={products} limit={5} />;
}
