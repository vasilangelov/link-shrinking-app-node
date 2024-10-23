import { Router } from "express";

import { getLinkProviders } from "@/services/link-providers";

const linkProvidersRouter = Router();

linkProvidersRouter.get("/", async (req, res) => {
  const linkProviders = await getLinkProviders();

  res.send(
    linkProviders.map((linkProvider) => ({
      ...linkProvider,
      allowedDomains: JSON.parse(linkProvider.allowedDomains),
    }))
  );
});

export default linkProvidersRouter;
