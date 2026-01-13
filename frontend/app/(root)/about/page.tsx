export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-bold">About BookNest</h1>

      <p className="text-gray-700 leading-relaxed">
        BookNest is a modern book discovery platform designed to help users
        explore books easily and efficiently. It focuses on performance,
        scalability, and a clean user experience.
      </p>

      <p className="text-gray-700 leading-relaxed">
        The platform uses a structured backend built with NestJS and Prisma,
        where book data is collected and stored in a database. The frontend,
        built with Next.js and TanStack Query, consumes this data without
        over-fetching or unnecessary API calls.
      </p>

      <p className="text-gray-700 leading-relaxed">
        BookNest follows real-world best practices such as separating product
        lists from detailed product information, ensuring fast load times and a
        smooth browsing experience.
      </p>

      <div className="border-t pt-6">
        <p className="text-sm text-gray-500">
          Built as a full-stack project using NestJS, Prisma, PostgreSQL,
          Next.js, and TanStack Query.
        </p>
      </div>
    </div>
  );
}
