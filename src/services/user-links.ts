import dbClient from "@/data/db-client";
import type {
  CreateOrUpdateUserLinkInput,
  ReorderUserLinksInput,
} from "@/types/user-links";
import { getLinkProviders } from "./link-providers";

export async function getUserLinks(userId: number) {
  const userLinks = await dbClient.userLink.findMany({
    select: {
      linkProviderId: true,
      link: true,
      order: true,
    },
    where: {
      userId,
    },
  });

  return userLinks;
}

export async function createUserLink(
  userLink: CreateOrUpdateUserLinkInput,
  userId: number
) {
  const lastOrderValue =
    (
      await dbClient.userLink.aggregate({
        _max: {
          order: true,
        },
        where: {
          userId,
        },
      })
    )._max.order ?? 0;

  await dbClient.userLink.create({
    data: {
      userId,
      linkProviderId: userLink.linkProviderId,
      link: userLink.link,
      order: lastOrderValue + 1,
    },
  });
}

export async function updateUserLink(
  userLink: CreateOrUpdateUserLinkInput,
  userId: number
) {
  await dbClient.userLink.update({
    data: {
      linkProviderId: userLink.linkProviderId,
      link: userLink.link,
    },
    where: {
      userId_linkProviderId: {
        userId,
        linkProviderId: userLink.linkProviderId,
      },
    },
  });
}

export async function reorderUserLinks(
  linkProviderIds: ReorderUserLinksInput,
  userId: number
) {
  const userLinks = await getUserLinks(userId);

  const existingUserLinkSet = new Set(
    userLinks.map(({ linkProviderId }) => linkProviderId)
  );

  const linkProviderIdSet = new Set<number>();

  const uniqueLinkProviderIds = linkProviderIds.filter((linkProviderId) => {
    if (!existingUserLinkSet.has(linkProviderId)) {
      return false;
    }

    if (linkProviderIdSet.has(linkProviderId)) {
      return false;
    }

    linkProviderIdSet.add(linkProviderId);

    return true;
  });

  userLinks
    .filter((userLink) => !linkProviderIdSet.has(userLink.linkProviderId))
    .sort(({ order: orderA }, { order: orderB }) => orderA - orderB)
    .forEach(({ linkProviderId }) => {
      uniqueLinkProviderIds.push(linkProviderId);
    });

  await dbClient.$transaction(
    uniqueLinkProviderIds.map((linkProviderId, index) =>
      dbClient.userLink.update({
        data: {
          order: index + 1,
        },
        where: {
          userId_linkProviderId: {
            userId,
            linkProviderId,
          },
        },
      })
    )
  );
}

export async function deleteUserLink(linkProviderId: number, userId: number) {
  await dbClient.userLink.delete({
    where: {
      userId_linkProviderId: {
        userId,
        linkProviderId,
      },
    },
  });
}
