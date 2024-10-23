import { Router } from "express";

import { authMiddleware } from "@/services/auth";
import { authController } from "@/utils/controllers";
import multer from "multer";
import { userProfileSchema } from "@/validators/profile";
import { validateSchemaSync } from "@/utils/validators";
import { HTTPStatusCode } from "@/constants/http";
import sharp from "sharp";
import dbClient from "@/data/db-client";
import path from "path";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromise from "fs/promises";

const profileRouter = Router();

const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });

profileRouter.get("/:id([0-9+])", async (req, res) => {
  const userId = Number(req.params.id);

  const userResponse = await dbClient.user.findFirst({
    select: {
      profilePicturePath: true,
      firstName: true,
      lastName: true,
      email: true,
      userLinks: {
        select: {
          linkProviderId: true,
          link: true,
          order: true,
        },
      },
    },
    where: {
      id: userId,
    },
  });

  if (!userResponse) {
    return void res.status(HTTPStatusCode.NotFound).send();
  }

  res.status(HTTPStatusCode.Ok).send(userResponse);
});

profileRouter.get(
  "/",
  authMiddleware,
  authController(async (req, res) => {
    const user = await dbClient.user.findFirstOrThrow({
      select: {
        profilePicturePath: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      where: {
        id: req.user.id,
      },
    });

    res.send(user);
  })
);

profileRouter.put(
  "/",
  authMiddleware,
  upload.single("profilePicture"),
  authController(async (req, res, next) => {
    const image = req.file;

    let profilePicturePath: string | null = null;

    if (image) {
      if (image.mimetype !== "image/png" && image.mimetype !== "image/jpeg") {
        return void res.status(HTTPStatusCode.BadRequest).send({
          status: HTTPStatusCode.BadRequest,
          error: {
            message: "One or more validation errors have occurred.",
            details: [
              {
                field: "profilePicture",
                issue: "Profile picture must be either in PNG or JPEG format.",
              },
            ],
          },
        });
      }

      if (image.size > 5 * 1024 * 1024) {
        return void res.status(HTTPStatusCode.BadRequest).send({
          status: HTTPStatusCode.BadRequest,
          error: {
            message: "One or more validation errors have occurred.",
            details: [
              {
                field: "profilePicture",
                issue: "Profile picture must be maximum 5MB.",
              },
            ],
          },
        });
      }

      const imageName = uuid();

      const folder = path.join(__dirname, "..", "public", "profile-pictures");

      if (!fs.existsSync(folder)) {
        await fsPromise.mkdir(folder, {
          recursive: true,
        });
      }

      const imageInfo = sharp(image.buffer);

      const { width = 0, height = 0 } = await imageInfo.metadata();

      const size = Math.min(width, height, 1024);

      await imageInfo
        .resize(size, size, { fit: "cover", withoutEnlargement: true })
        .toFormat("webp")
        .toFile(path.join(folder, `${imageName}.webp`));

      profilePicturePath = `/static/profile-pictures/${imageName}.webp`;

      const { profilePicturePath: oldProfilePicturePath } =
        await dbClient.user.findFirstOrThrow({
          select: { profilePicturePath: true },
          where: { id: req.user.id },
        });

      if (oldProfilePicturePath !== null) {
        const tokens = oldProfilePicturePath.split("/");
        const oldFilename = tokens[tokens.length - 1];

        try {
          await fsPromise.rm(path.join(folder, oldFilename));
        } catch {}
      }
    }

    const validationResult = validateSchemaSync(req.body, userProfileSchema);

    if (!validationResult.isValid) {
      return void res.status(HTTPStatusCode.BadRequest).send({
        status: HTTPStatusCode.BadRequest,
        error: {
          message: "One or more validation errors have occurred.",
          details: validationResult.errors,
        },
      });
    }

    await dbClient.user.update({
      data: {
        email: validationResult.payload.email,
        firstName: validationResult.payload.firstName,
        lastName: validationResult.payload.lastName,
        profilePicturePath,
      },
      where: {
        id: req.user.id,
      },
    });

    res.status(HTTPStatusCode.NoContent).send();
  })
);

export default profileRouter;
