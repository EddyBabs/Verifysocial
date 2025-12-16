"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function FacebookCallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast({
        description: success,
        variant: "default",
      });
      // Clean up URL params
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (error) {
      toast({
        description: error,
        variant: "destructive",
      });
      // Clean up URL params
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  return null;
}
