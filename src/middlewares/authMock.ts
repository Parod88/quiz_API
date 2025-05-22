import { NextFunction, Response } from "express";

export function authMock(req: any, _: Response, next: NextFunction) {
  const prob = Math.random();

  if (prob < 0.45) {
    req.user = {
      id: "1e684e82-f501-4840-a1af-e397a4248270",
    };
    return next();
  }

  if (prob < 0.9) {
    req.user = {
      id: "7ee2fd06-62f1-4a0a-8337-4b61d7c1ef5b",
    };

    return next();
  }

  return next();
}
