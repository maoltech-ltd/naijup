// Sends public form submissions (contact, newsletter, ...) through maol_service,
// which delivers them to admin@naijup.ng.
const MAIL_SERVICE_URL = process.env.NEXT_PUBLIC_MAIL_SERVICE_URL || "";
const MAIL_API_KEY = process.env.NEXT_PUBLIC_MAIL_API_KEY || "";

export interface PublicMailPayload {
  type: string;
  message: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  metadata?: Record<string, unknown>;
}

export async function sendPublicMail(payload: PublicMailPayload): Promise<void> {
  if (!MAIL_SERVICE_URL) {
    throw new Error("Mail service is not configured");
  }

  const res = await fetch(`${MAIL_SERVICE_URL.replace(/\/+$/, "")}/api/v1/naijup/public-mail`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": MAIL_API_KEY },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Unable to send your message, please try again later");
  }
}
