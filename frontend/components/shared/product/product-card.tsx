import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api/products";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const priceLabel =
    product.price !== null
      ? `${product.currency === "GBP" ? "£" : "$"}${product.price}`
      : null;

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block w-full">
          <div className="relative w-full h-[280px] bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-contain"
                priority={false}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        {/* Title */}
        <h2 className="text-sm font-semibold leading-snug line-clamp-2">
          {product.title}
        </h2>

        {/* Author */}
        {product.author && (
          <p className="text-sm text-muted-foreground">by {product.author}</p>
        )}

        {/* Price */}
        {priceLabel ? (
          <p className="text-base font-extrabold text-foreground">
            {priceLabel}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Price not available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
