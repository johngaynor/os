"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Main = () => {
  const { user, isLoaded } = useUser();

  // Redirect authenticated users to dashboard
  if (user) redirect("/dashboard");

  // Redirect unauthenticated users to sign-in page
  if (isLoaded && !user) {
    redirect("/sign-in");
  }

  return null;
};

export default Main;
