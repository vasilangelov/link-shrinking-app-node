import z from "zod";

import {
  createOrUpdateUserLinkSchema,
  reorderUserLinksSchema,
} from "@/validators/user-links";

export type CreateOrUpdateUserLinkInput = z.infer<
  typeof createOrUpdateUserLinkSchema
>;

export type ReorderUserLinksInput = z.infer<typeof reorderUserLinksSchema>;
