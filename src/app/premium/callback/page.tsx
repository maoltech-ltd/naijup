"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { PENDING_REFERENCE_KEY, verifyPremiumPayment } from "@/src/utils/premium";

type State = "checking" | "active" | "pending" | "failed" | "signin";

const MAX_ATTEMPTS = 6;

function CallbackInner() {
  const params = useSearchParams();
  const user = useSelector((state: RootState) => state.user);
  const [state, setState] = useState<State>("checking");
  const [until, setUntil] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (!user?.token) {
      // redux-persist may still be rehydrating; give it a moment.
      const timer = setTimeout(() => !user?.token && setState("signin"), 1500);
      return () => clearTimeout(timer);
    }
    started.current = true;

    let stored = "";
    try {
      stored = sessionStorage.getItem(PENDING_REFERENCE_KEY) || "";
    } catch {}
    // Our reference is maol_payment's txRef. Paystack echoes it as
    // reference/trxref, Flutterwave as tx_ref (+ transaction_id).
    const reference = stored || params.get("reference") || params.get("trxref") || params.get("tx_ref") || "";
    const transactionId = params.get("transaction_id") || "";

    let attempt = 0;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      attempt += 1;
      try {
        const { payment, subscription } = await verifyPremiumPayment(user.token, reference, transactionId);
        if (payment.status === "COMPLETED") {
          try {
            sessionStorage.removeItem(PENDING_REFERENCE_KEY);
          } catch {}
          if (subscription.current_period_end) {
            setUntil(new Date(subscription.current_period_end).toLocaleDateString("en-NG", {
              day: "numeric", month: "long", year: "numeric",
            }));
          }
          setState("active");
          return;
        }
        if (payment.status === "FAILED") {
          setState("failed");
          return;
        }
      } catch {
        // fall through to retry
      }
      if (attempt < MAX_ATTEMPTS) {
        timer = setTimeout(check, 4000);
      } else {
        setState("pending");
      }
    };
    check();
    return () => clearTimeout(timer);
  }, [params, user?.token]);

  const copy: Record<State, { title: string; body: string }> = {
    checking: { title: "Confirming your payment…", body: "This usually takes a few seconds." },
    active: {
      title: "You're now a Premium member",
      body: until ? `Full access is unlocked until ${until}.` : "Full access is unlocked.",
    },
    pending: {
      title: "Payment still processing",
      body: "Your bank hasn't confirmed the payment yet. Premium unlocks automatically once it does, and we'll email you.",
    },
    failed: { title: "Payment didn't go through", body: "You weren't charged for Premium. You can try again." },
    signin: { title: "Sign in to finish", body: "Sign in with the account you subscribed with to confirm your payment." },
  };

  return (
    <main className="mx-auto max-w-xl px-5 py-20 text-center text-dark dark:text-light">
      <h1 className="text-2xl font-bold md:text-3xl">{copy[state].title}</h1>
      <p className="mt-3 text-dark/70 dark:text-light/70">{copy[state].body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {state === "active" && (
          <Link href="/investment-analysis" className="rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light dark:bg-light dark:text-dark">
            Start reading
          </Link>
        )}
        {state === "failed" && (
          <Link href="/premium" className="rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light dark:bg-light dark:text-dark">
            Try again
          </Link>
        )}
        {state === "signin" && (
          <Link href="/signin" className="rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light dark:bg-light dark:text-dark">
            Sign in
          </Link>
        )}
        {(state === "pending" || state === "active") && (
          <Link href="/premium" className="rounded-full border border-dark/20 px-6 py-3 text-sm font-semibold dark:border-light/20">
            Manage Premium
          </Link>
        )}
      </div>
    </main>
  );
}

export default function PremiumCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
