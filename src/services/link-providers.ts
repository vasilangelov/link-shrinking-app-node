import { Prisma } from "@prisma/client";

import dbClient from "@/data/db-client";

let LINK_PROVIDER_CACHE: Prisma.$LinkProviderPayload["scalars"][];

export async function getLinkProviders() {
  if (!LINK_PROVIDER_CACHE) {
    LINK_PROVIDER_CACHE = await dbClient.linkProvider.findMany();
  }

  return LINK_PROVIDER_CACHE;
}

let LINK_PROVIDER_MAP = new Map<
  Prisma.$LinkProviderPayload["scalars"]["id"],
  Prisma.$LinkProviderPayload["scalars"] | undefined
>();

export async function getLinkProvider(
  linkProviderId: Prisma.$LinkProviderPayload["scalars"]["id"]
) {
  let value = LINK_PROVIDER_MAP.get(linkProviderId);

  if (value !== undefined) {
    return value;
  }

  const linkProviders = await getLinkProviders();

  value = linkProviders.find(
    (linkProvider) => linkProvider.id === linkProviderId
  );

  LINK_PROVIDER_MAP.set(linkProviderId, value);

  return value;
}
