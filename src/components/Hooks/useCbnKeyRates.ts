"use client";

import { useEffect, useState } from "react";
import api from "@/src/api";

export interface CbnKeyRate {
  code: "MPR" | "INFLATION" | "USDNGN" | "NTB_91" | "NOFR" | string;
  label: string;
  value: number;
  unit: "%" | "NGN" | string;
  as_of: string | null;
  source_url: string;
  previous: number | null;
  change: number | null;
  direction: "up" | "down" | "flat";
}

export interface CbnKeyRatesResponse {
  source: string;
  source_url: string;
  fetched_at: string;
  rates: CbnKeyRate[];
  headlines: string[];
}

// Shared across components on the same page so the endpoint is requested once per load.
let pending: Promise<CbnKeyRatesResponse> | null = null;

const loadCbnKeyRates = () => {
  if (!pending) {
    pending = api
      .get("v1/market/cbn-key-rates/")
      .then((response) => response.data as CbnKeyRatesResponse)
      .catch((error) => {
        pending = null;
        throw error;
      });
  }
  return pending;
};

export function useCbnKeyRates() {
  const [data, setData] = useState<CbnKeyRatesResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed">("loading");

  useEffect(() => {
    let isMounted = true;
    loadCbnKeyRates()
      .then((response) => {
        if (!isMounted) return;
        setData(response);
        setStatus("succeeded");
      })
      .catch(() => {
        if (isMounted) setStatus("failed");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, status };
}
