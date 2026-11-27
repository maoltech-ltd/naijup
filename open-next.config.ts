import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

// No incremental cache (no R2/KV): pages render on each request and call the
// backend directly. `revalidate` values are effectively ignored on Cloudflare.
export default defineCloudflareConfig({});
