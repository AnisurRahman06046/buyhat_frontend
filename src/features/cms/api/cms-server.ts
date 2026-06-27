import { serverApi } from "@/lib/server/backend";
import type { Homepage } from "@/types/cms";

/** RSC fetch of the CMS homepage (revalidated). */
export function getHomepageServer(): Promise<Homepage> {
  return serverApi<Homepage>("/cms/homepage", { revalidate: 120 });
}
