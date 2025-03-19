"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to admin dashboard first
    router.push("/dashboard");
  }, [router]);

  return null;
}