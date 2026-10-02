"use client";

import { useEffect, useState } from "react";
import api from "@/src/api";

export interface NbsIndicator {
  code: string;
  label: string;
  name?: string;
  unit?: string | null;
  period: string | null;
  value: number;
  previous: number | null;
  change: number | null;
  change_percent: number | null;
  direction: "up" | "down" | "flat";
  history: number[];
  description?: string;
}

export interface NbsIndicatorsResponse {
  source: string;
  source_url: string;
  fetched_at: string;
  inflation: { headline: NbsIndicator; components: NbsIndicator[] } | null;
  petroleum: NbsIndicator[];
  headlines: string[];
}

// Shared across components on the same page (market section + T-bill calculator)
// so the NBS endpoint is only requested once per page load.
let pending: Promise<NbsIndicatorsResponse> | null = null;

const loadNbsIndicators = () => {
  if (!pending) {
    pending = api
      .get("v1/market/nbs-indicators/")
      .then((response) => response.data as NbsIndicatorsResponse)
      .catch((error) => {
        pending = null;
        throw error;
      });
  }
  return pending;
};

export function useNbsIndicators() {
  const [data, setData] = useState<NbsIndicatorsResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed">("loading");

  useEffect(() => {
    let isMounted = true;
    loadNbsIndicators()
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
