"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <span className="animate-pulse h-5 w-5 bg-gray-300 rounded-full" />;
  }

  return (
    <div className="flex items-center gap-2">
      {isSignedIn ? (
        <>
          {/* Botón personalizado para ir al dashboard */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/dashboards")}
            className="flex items-center gap-1"
          >
            <LayoutDashboard className="h-4 w-4" />
            Panel
          </Button>

          {/* Avatar de Clerk */}
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
