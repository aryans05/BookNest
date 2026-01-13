"use client";

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Image
        src="/image/logo.svg"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority
      />

      <div className="mt-6 w-full max-w-md rounded-lg border p-6 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
        <p className="text-muted-foreground">
          Could not find the requested page.
        </p>

        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
