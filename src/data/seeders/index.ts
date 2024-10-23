import seedLinkProviders from "@/data/seeders/link-providers";

const SEEDERS: Readonly<(() => Promise<void>)[]> = [seedLinkProviders];

export default async function seedDatabase() {
  await Promise.all(SEEDERS.map((seed) => seed()));
}
