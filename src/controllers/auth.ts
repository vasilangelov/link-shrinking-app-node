import { Router } from "express";

import { HTTPHeader, HTTPMimeType, HTTPStatusCode } from "@/constants/http";
import { createUser, login, passport } from "@/services/auth";
import { controller } from "@/utils/controllers";
import { validateSchemaSync } from "@/utils/validators";
import { loginSchema, registerSchema } from "@/validators/auth";

const authRouter = Router();

authRouter.post(
  "/register",
  controller(async (req, res) => {
    const validationResult = validateSchemaSync(req.body, registerSchema);

    if (!validationResult.isValid) {
      return res.status(HTTPStatusCode.BadRequest).send({
        status: HTTPStatusCode.BadRequest,
        error: {
          message: "One or more validation errors have occurred.",
          details: validationResult.errors,
        },
      });
    }

    const { email, firstName, lastName } = validationResult.payload;

    await createUser(
      {
        email,
        firstName,
        lastName,
      },
      validationResult.payload.password
    );

    return res.status(HTTPStatusCode.Created).send();
  })
);

authRouter.post(
  "/login",
  controller(async (req, res) => {
    const validationResult = validateSchemaSync(req.body, loginSchema);

    if (!validationResult.isValid) {
      return void res.status(HTTPStatusCode.BadRequest).send({
        status: HTTPStatusCode.BadRequest,
        error: {
          message: "One or more validation errors have occurred.",
          details: validationResult.errors,
        },
      });
    }

    const { email, password } = validationResult.payload;

    const token = await login(email, password);

    if (!token) {
      return void res.status(HTTPStatusCode.Unauthorized).send();
    }

    res
      .status(HTTPStatusCode.Ok)
      .setHeader(HTTPHeader.ContentType, HTTPMimeType.TextPlain)
      .send(token);
  })
);

export default authRouter;
