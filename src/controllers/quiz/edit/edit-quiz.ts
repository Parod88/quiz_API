import { Request, Response } from "express";
import { Quiz } from "../../../models/Quiz";
import {
  fail,
  notFound,
  ok,
  validationFailed,
} from "../../../utils/errors-handling";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";
import mongoose from "mongoose";

export const putEditQuiz = async (req: Request, res: Response) => {
  let params;

  const { errors, values } = validate(constraint(req));
  if (errors.length) {
    return validationFailed(res, errors);
  }
  params = values;

  try {
    const result = await Quiz.findByIdAndUpdate(params.quizId, params, {
      new: true,
    });

    if (!result) {
      return notFound(res, "not Found");
    }

    return ok(res, result);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return notFound(res, "Quiz not found");
    } else {
      return fail(res, error);
    }
  }
};
