"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/dashboard") {
      router.push("/dashboard/home");
    }
  }, []);

  return <></>;
}
