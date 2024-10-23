import type { NextFunction, Request, Response } from "express";

import { HTTPStatusCode } from "@/constants/http";

type User = {
  id: number;
};

type ExpressRequest = Omit<Request, "user"> & {
  user?: User;
};

export function controller<
  Handler extends (
    req: ExpressRequest,
    res: Response,
    next: NextFunction
  ) => unknown
>(handler: Handler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = handler(req as ExpressRequest, res, next);

      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      next(error);
    }
  };
}

type ExpressAuthRequest = Omit<Request, "user"> & {
  user: User;
};

export function authController<
  Handler extends (
    req: ExpressAuthRequest,
    res: Response,
    next: NextFunction
  ) => unknown
>(handler: Handler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return void res.status(HTTPStatusCode.Unauthorized).send({
          status: HTTPStatusCode.Unauthorized,
          message:
            "You are not authorized to access this resource. Please log in and try again.",
        });
      }

      const result = handler(req as ExpressAuthRequest, res, next);

      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      next(error);
    }
  };
}
