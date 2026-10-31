"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/common/spinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Only redirect when pending state is completely resolved and there is no session
    if (!isPending && !session) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Checking library pass..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
