type EditorialReviewsProps = {
  reviews: Record<string, string>;
};

export default function EditorialReviews({ reviews }: EditorialReviewsProps) {
  return (
    <div className="space-y-4">
      {Object.entries(reviews).map(([source, quote]) => (
        <div
          key={source}
          className="border-l-4 border-black bg-gray-50 p-4 rounded"
        >
          <p className="italic text-gray-800">“{quote}”</p>
          <p className="mt-2 text-sm font-semibold text-gray-600">— {source}</p>
        </div>
      ))}
    </div>
  );
}
