"use client";
import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { faceBookToken } from "@/actions/instagram";
import { toast } from "@/hooks/use-toast";

const InstagramCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const fetchAccessToken = useCallback(async () => {
    if (code) {
      const response = await faceBookToken(code);
      if (response.success) {
        toast({ description: response.success });
      } else {
        toast({ description: response.error, variant: "destructive" });
      }
    }
  }, [code]);

  useEffect(() => {
    if (code) {
      fetchAccessToken();
    }
  }, [code, fetchAccessToken]);
  return <></>;
};

export default InstagramCallback;
