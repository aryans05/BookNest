import ProductCard from "./product-card";
import type { Product } from "@/lib/api/products";

type ProductListProps = {
  data: Product[];
  title?: string;
  limit?: number;
};

const ProductList = ({ data, title, limit }: ProductListProps) => {
  const products = limit ? data.slice(0, limit) : data;

  if (!products || products.length === 0) {
    return (
      <div className="my-10">
        {title && <h2 className="h2-bold mb-4">{title}</h2>}
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <section className="my-10">
      {title && <h2 className="h2-bold mb-4">{title}</h2>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
