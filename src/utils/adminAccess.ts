export const ADMIN_ALLOWED_EMAILS = [
  "maoltech27@gmail.com",
  "hardeyshinnah.mo@gmail.com",
  "admin@naijup.ng",
];

export function canAccessAdminReports(email?: string | null) {
  if (!email) return false;
  return ADMIN_ALLOWED_EMAILS.includes(email.toLowerCase());
}
