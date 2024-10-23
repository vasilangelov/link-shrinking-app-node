import { getLinkProvider } from "@/services/link-providers";
import z from "zod";

const LINK_PROVIDER_ID_PROPERTY = "linkProviderId";
const LINK_PROPERTY = "link";

export const createOrUpdateUserLinkSchema = z
  .object({
    [LINK_PROVIDER_ID_PROPERTY]: z.number(),
    [LINK_PROPERTY]: z.string().url(),
  })
  .superRefine(async (userLink, ctx) => {
    const linkProvider = await getLinkProvider(
      userLink[LINK_PROVIDER_ID_PROPERTY]
    );

    if (linkProvider === undefined) {
      return void ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [LINK_PROVIDER_ID_PROPERTY],
        message: "Invalid provider id.",
      });
    }

    const allowedDomains: string[] = JSON.parse(linkProvider.allowedDomains);

    if (
      allowedDomains.every(
        (allowedDomain) => !userLink[LINK_PROPERTY].includes(allowedDomain)
      )
    ) {
      return void ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [LINK_PROPERTY],
        message: "Invalid domain.",
      });
    }
  });

export const reorderUserLinksSchema = z.array(z.number());
