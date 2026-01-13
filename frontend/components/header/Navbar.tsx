"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchNavigations,
  fetchCategoriesByNavigation,
  Navigation,
  Category,
} from "@/lib/api/navigaion";

export default function Navbar() {
  const [activeNavId, setActiveNavId] = useState<number | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  /* =====================
     MAIN NAVIGATION
  ===================== */
  const {
    data: navigations,
    isLoading,
    error,
  } = useQuery<Navigation[]>({
    queryKey: ["navigations"],
    queryFn: fetchNavigations,
  });

  /* =====================
     CATEGORIES (PER NAV)
  ===================== */
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories", activeNavId],
    queryFn: () => fetchCategoriesByNavigation(activeNavId as number),
    enabled: !!activeNavId,
    staleTime: 1000 * 60 * 10,
  });

  /* =====================
     HOVER HANDLERS
  ===================== */
  const handleMouseEnter = (navId: number) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setActiveNavId(navId);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveNavId(null);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  if (isLoading) {
    return (
      <nav className="border-b bg-white h-14 flex items-center justify-center">
        <span className="text-sm text-gray-500">Loading navigation…</span>
      </nav>
    );
  }

  if (error || !navigations) {
    return (
      <nav className="border-b bg-white h-14 flex items-center justify-center">
        <span className="text-sm text-red-500">Failed to load navigation</span>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-center gap-16">
        {navigations.map((nav) => (
          <div
            key={nav.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(nav.id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* MAIN HEADING */}
            <Link
              href={`/categories/${nav.slug}`}
              className="font-semibold text-gray-800 hover:text-gray-600 transition"
            >
              {nav.title.replace(" Books", "")}
            </Link>

            {/* DROPDOWN */}
            {activeNavId === nav.id && (
              <div
                className="absolute left-1/2 top-full mt-4 w-72 -translate-x-1/2 rounded-md border bg-white shadow-lg"
                onMouseEnter={() => handleMouseEnter(nav.id)}
                onMouseLeave={handleMouseLeave}
              >
                {isCategoriesLoading ? (
                  <div className="p-4 text-sm text-gray-500">
                    Loading categories…
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    No categories found
                  </div>
                ) : (
                  <ul className="p-4 space-y-2">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/categories/${nav.slug}/${cat.slug}`}
                          className="block text-sm text-gray-700 hover:text-black transition"
                        >
                          {cat.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
