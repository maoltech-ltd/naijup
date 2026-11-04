"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { getPremiumStatus } from "@/src/utils/premium";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9335680421453806";
const AD_FREE_CLASS = "naijup-ad-free";

/**
 * Loads Google AdSense (auto ads) for everyone except logged-in Premium
 * readers. Waits for the persisted user to rehydrate and, if logged in, for
 * the Premium check before deciding, so Premium readers never get the script.
 * If ads were already loaded (e.g. the reader just signed in or subscribed),
 * the `naijup-ad-free` class on <html> hides any placed ad units.
 */
export default function AdSense() {
  const rehydrated = useSelector((state: RootState) => Boolean((state as any)._persist?.rehydrated));
  const token = useSelector((state: RootState) => state.user?.token);
  const [adFree, setAdFree] = useState<boolean | null>(null);

  useEffect(() => {
    if (!rehydrated) return;
    if (!token) {
      setAdFree(false);
      return;
    }
    let cancelled = false;
    setAdFree(null);
    getPremiumStatus(token)
      .then((status) => !cancelled && setAdFree(Boolean(status.is_premium)))
      .catch(() => !cancelled && setAdFree(false));
    return () => {
      cancelled = true;
    };
  }, [rehydrated, token]);

  useEffect(() => {
    document.documentElement.classList.toggle(AD_FREE_CLASS, adFree === true);
  }, [adFree]);

  if (adFree !== false) return null;
  return <Script id="google-adsense" strategy="lazyOnload" src={ADSENSE_SRC} crossOrigin="anonymous" />;
}
