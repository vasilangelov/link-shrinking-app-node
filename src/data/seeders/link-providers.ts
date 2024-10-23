import dbClient from "@/data/db-client";

const linkProvidersToSeed = [
  {
    name: "GitHub",
    iconName: "github.svg",
    allowedDomains: ["github.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#1A1A1A",
  },
  {
    name: "Frontend Mentor",
    iconName: "frontend-mentor.svg",
    allowedDomains: ["frontendmentor.io"],
    textColor: "#333333",
    backgroundColor: "#FFFFFF",
  },
  {
    name: "Twitter",
    iconName: "twitter.svg",
    allowedDomains: ["twitter.com", "x.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#43B7E9",
  },
  {
    name: "LinkedIn",
    iconName: "linkedin.svg",
    allowedDomains: ["linkedin.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#2D68FF",
  },
  {
    name: "YouTube",
    iconName: "youtube.svg",
    allowedDomains: ["youtube.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#EE3939",
  },
  {
    name: "Facebook",
    iconName: "facebook.svg",
    allowedDomains: ["facebook.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#2442AC",
  },
  {
    name: "Twitch",
    iconName: "twitch.svg",
    allowedDomains: ["twitch.tv"],
    textColor: "#FFFFFF",
    backgroundColor: "#EE3FC8",
  },
  {
    name: "Dev.to",
    iconName: "devto.svg",
    allowedDomains: ["dev.to"],
    textColor: "#FFFFFF",
    backgroundColor: "#333333",
  },
  {
    name: "Codewars",
    iconName: "codewars.svg",
    allowedDomains: ["codewars.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#8A1A50",
  },
  {
    name: "Codepen",
    iconName: "codepen.svg",
    allowedDomains: ["codepen.io"],
    textColor: "#FFFFFF",
    backgroundColor: "#1E1F26",
  },
  {
    name: "freeCodeCamp",
    iconName: "freecodecamp.svg",
    allowedDomains: ["freecodecamp.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#8A1A50",
  },
  {
    name: "GitLab",
    iconName: "gitlab.svg",
    allowedDomains: ["gitlab.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#302267",
  },
  {
    name: "Hashnode",
    iconName: "hashnode.svg",
    allowedDomains: ["hashnode.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#0330D1",
  },
  {
    name: "Stack Overflow",
    iconName: "stack-overflow.svg",
    allowedDomains: ["stackoverflow.com"],
    textColor: "#FFFFFF",
    backgroundColor: "#EC7100",
  },
];

export default async function seedLinkProviders() {
  const linkProvidersCount = await dbClient.linkProvider.count();

  if (linkProvidersCount > 0) {
    return;
  }

  await dbClient.linkProvider.createMany({
    data: linkProvidersToSeed.map((linkProvider) => ({
      ...linkProvider,
      allowedDomains: JSON.stringify(linkProvider.allowedDomains),
    })),
  });
}
