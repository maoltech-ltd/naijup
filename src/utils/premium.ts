import api from "@/src/api";

export interface PremiumPlan {
  code: string;
  name: string;
  amount: number;
  days: number;
}

export interface PremiumStatus {
  is_premium: boolean;
  is_subscribed: boolean;
  plan: string;
  current_period_end: string | null;
  notify_new_posts: boolean;
}

export interface PremiumPayment {
  reference: string;
  plan: string;
  amount: string;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  period_end: string | null;
}

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export async function getPremiumPlans(): Promise<{ currency: string; plans: PremiumPlan[] }> {
  const { data } = await api.get("v1/subscription/plans/");
  return data;
}

export async function getPremiumStatus(token: string): Promise<PremiumStatus> {
  const { data } = await api.get("v1/subscription/me/", authHeaders(token));
  return data;
}

export async function setNewPostEmails(token: string, enabled: boolean): Promise<PremiumStatus> {
  const { data } = await api.patch("v1/subscription/me/", { notify_new_posts: enabled }, authHeaders(token));
  return data;
}

export async function startPremiumCheckout(token: string, plan: string): Promise<{ reference: string; checkout_url: string }> {
  const { data } = await api.post("v1/subscription/checkout/", { plan }, authHeaders(token));
  return data;
}

export async function verifyPremiumPayment(
  token: string,
  reference?: string,
  transactionId?: string
): Promise<{ payment: PremiumPayment; subscription: PremiumStatus }> {
  const { data } = await api.post(
    "v1/subscription/verify/",
    { reference: reference || "", transaction_id: transactionId || "" },
    authHeaders(token)
  );
  return data;
}

export async function getFullPost(slug: string, token: string) {
  const { data } = await api.get(`v1/blog/post/slug/${slug}/`, authHeaders(token));
  return data;
}

export function formatNaira(amount: number | string) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export const PENDING_REFERENCE_KEY = "naijup:premium-reference";

// ---- Super admin -----------------------------------------------------------

export interface PremiumSettings {
  monthly_price: number;
  monthly_days: number;
  monthly_enabled: boolean;
  yearly_price: number;
  yearly_days: number;
  yearly_enabled: boolean;
  reminder_days_before: number;
  updated_at?: string;
  updated_by?: string | null;
}

export interface PremiumSubscriber {
  user_id: number;
  email: string;
  username: string;
  plan: string;
  current_period_end: string | null;
  is_active: boolean;
  notify_new_posts: boolean;
}

export async function getAdminPremiumSettings(token: string): Promise<PremiumSettings> {
  const { data } = await api.get("v1/subscription/admin/settings/", authHeaders(token));
  return data;
}

export async function saveAdminPremiumSettings(token: string, values: Partial<PremiumSettings>): Promise<PremiumSettings> {
  const { data } = await api.put("v1/subscription/admin/settings/", values, authHeaders(token));
  return data;
}

export async function getAdminSubscribers(
  token: string,
  status: string,
  q: string
): Promise<{ counts: { active: number; expired: number }; results: PremiumSubscriber[] }> {
  const { data } = await api.get("v1/subscription/admin/subscribers/", {
    ...authHeaders(token),
    params: { status: status || undefined, q: q || undefined },
  });
  return data;
}

export async function updateAdminSubscriber(
  token: string,
  target: { userId?: number; email?: string },
  change: { extend_days?: number; current_period_end?: string; revoke?: boolean }
): Promise<PremiumSubscriber> {
  const url = target.userId
    ? `v1/subscription/admin/subscribers/${target.userId}/`
    : "v1/subscription/admin/subscribers/grant/";
  const { data } = await api.post(url, { email: target.email, ...change }, authHeaders(token));
  return data;
}
