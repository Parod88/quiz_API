import { Request, Response } from "express";
import {
  created,
  fail,
  validationFailed,
} from "../../../utils/errors-handling";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";
import { Quiz } from "../../../models/Quiz";

export const postCreateQuiz = async (req: Request, res: Response) => {
  let params;

  const { errors, values } = validate(constraint(req));
  if (errors.length) {
    return validationFailed(res, errors);
  }
  params = values;

  try {
    const result = await Quiz.create(params);

    return created(res, result);
  } catch (error) {
    return fail(res, error);
  }
};
