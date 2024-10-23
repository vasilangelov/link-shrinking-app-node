import { Router } from "express";

import { HTTPStatusCode } from "@/constants/http";
import { authMiddleware } from "@/services/auth";
import {
  createUserLink,
  deleteUserLink,
  getUserLinks,
  reorderUserLinks,
  updateUserLink,
} from "@/services/user-links";
import { authController } from "@/utils/controllers";
import { validateSchemaAsync, validateSchemaSync } from "@/utils/validators";
import {
  createOrUpdateUserLinkSchema,
  reorderUserLinksSchema,
} from "@/validators/user-links";

const userLinksRouter = Router();

userLinksRouter.use(authMiddleware);

userLinksRouter.get(
  "/",
  authController(async (req, res) => {
    const value = await getUserLinks(req.user.id);

    return res.send(value);
  })
);

userLinksRouter.post(
  "/",
  authController(async (req, res) => {
    const validationResult = await validateSchemaAsync(
      req.body,
      createOrUpdateUserLinkSchema
    );

    if (!validationResult.isValid) {
      return void res.status(HTTPStatusCode.BadRequest).send({
        status: HTTPStatusCode.BadRequest,
        error: {
          message: "One or more validation errors have occurred.",
          details: validationResult.errors,
        },
      });
    }

    await createUserLink(validationResult.payload, req.user.id);

    res.status(HTTPStatusCode.Created).send();
  })
);

userLinksRouter.put(
  "/",
  authController(async (req, res) => {
    const validationResult = await validateSchemaAsync(
      req.body,
      createOrUpdateUserLinkSchema
    );

    if (!validationResult.isValid) {
      return void res.status(HTTPStatusCode.BadRequest).send({
        status: HTTPStatusCode.BadRequest,
        error: {
          message: "One or more validation errors have occurred.",
          details: validationResult.errors,
        },
      });
    }

    await updateUserLink(validationResult.payload, req.user.id);

    res.status(HTTPStatusCode.NoContent).send();
  })
);

userLinksRouter.put(
  "/reorder",
  authController(async (req, res) => {
    const validationResult = validateSchemaSync(
      req.body,
      reorderUserLinksSchema
    );

    if (!validationResult.isValid) {
      return void res.status(HTTPStatusCode.BadRequest).send({
        status: HTTPStatusCode.BadRequest,
        error: {
          message: "One or more validation errors have occurred.",
          details: validationResult.errors,
        },
      });
    }

    await reorderUserLinks(validationResult.payload, req.user.id);

    res.status(HTTPStatusCode.NoContent).send();
  })
);

userLinksRouter.delete(
  "/:linkProviderId([0-9+])",
  authController(async (req, res) => {
    const linkProviderId = Number(req.params.linkProviderId);

    await deleteUserLink(linkProviderId, req.user.id);

    res.status(HTTPStatusCode.NoContent).send();
  })
);

export default userLinksRouter;
