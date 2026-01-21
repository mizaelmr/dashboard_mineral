"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const authentication = true;

  useEffect(() => {
    if(!authentication) {
      router.push("/login");
    }
  }, [authentication, router]);

  return (
   <h1>Dashboard</h1>
  );
}
