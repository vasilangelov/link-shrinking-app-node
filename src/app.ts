import express from "express";
import path from "path";

import { ENVIRONMENT, Environment, PORT, VERSION } from "@/constants/env";
import { HTTPStatusCode } from "@/constants/http";
import seedDatabase from "@/data/seeders";
import { passport } from "@/services/auth";

import authRouter from "@/controllers/auth";
import profileRouter from "@/controllers/profile";
import linksRouter from "@/controllers/user-links";
import linkProvidersRouter from "@/controllers/link-providers";
import apiDocsRouter from "@/controllers/api-docs";

async function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(passport.initialize());

  app.get("/", (req, res) => {
    res.redirect(`http://localhost:${PORT}/api-docs`);
  });

  app.use("/api-docs", apiDocsRouter);

  const baseRouter = express.Router();

  baseRouter.use("/static", express.static(path.join(__dirname, "public")));

  baseRouter.use(authRouter);
  baseRouter.use("/user-links", linksRouter);
  baseRouter.use("/link-providers", linkProvidersRouter);
  baseRouter.use("/profile", profileRouter);

  app.use(VERSION, baseRouter);

  app.use((_req, res) => {
    res.status(HTTPStatusCode.NotFound).send();
  });

  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      const value: {
        status: HTTPStatusCode;
        message: string;
        error?: unknown;
      } = {
        status: HTTPStatusCode.InternalServerError,
        message: "A server error has occurred.",
      };

      if (ENVIRONMENT === Environment.Development) {
        console.error(error);
        value.error = error;
      }

      res.status(HTTPStatusCode.InternalServerError).send(value);
    }
  );

  return app;
}

async function main() {
  await seedDatabase();

  const app = await setupServer();

  app.listen(PORT, () => {
    console.log(`App live on http://localhost:${PORT}`);
  });
}

main();
