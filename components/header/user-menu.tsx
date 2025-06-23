"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const goToDashboard = () => {
    console.log("Ir al dashboard");
    router.push("/dashboards"); // Asegúrate que esta ruta existe
  };

  if (!isLoaded) {
    return <span className="animate-pulse h-5 w-5 bg-gray-300 rounded-full" />;
  }

  return (
    <div className="flex items-center gap-2">
      {isSignedIn ? (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToDashboard}
            className="flex items-center gap-1"
          >
            <LayoutDashboard className="h-4 w-4" />
            Panel
          </Button>
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <UserIcon className="h-5 w-5" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
