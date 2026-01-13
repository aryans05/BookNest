import Link from "next/link";
import {
  fetchNavigations,
  fetchCategoriesByNavigation,
} from "@/lib/api/navigaion";

export default async function CategoriesPage() {
  const navigations = await fetchNavigations();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold">Categories</h1>

      {navigations.map(async (nav) => {
        const categories = await fetchCategoriesByNavigation(nav.id);

        if (!categories.length) return null;

        return (
          <div key={nav.id}>
            {/* Parent heading */}
            <h2 className="text-2xl font-semibold mb-4">{nav.title}</h2>

            {/* Sub categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${nav.slug}/${cat.slug}`}
                  className="border rounded-lg p-6 hover:shadow transition"
                >
                  <h3 className="text-lg font-medium">{cat.title}</h3>

                  <p className="text-gray-600 mt-2">
                    Browse books in this category
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
