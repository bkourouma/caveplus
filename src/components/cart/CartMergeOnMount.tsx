"use client";

import { useEffect } from "react";

export function CartMergeOnMount() {
  useEffect(() => {
    void fetch("/api/cart/merge", {
      method: "POST"
    });
  }, []);

  return null;
}
