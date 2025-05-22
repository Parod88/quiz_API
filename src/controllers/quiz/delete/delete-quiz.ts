import { Response } from "express";
import { Quiz } from "../../../models/Quiz";
import {
  fail,
  forbidden,
  notFound,
  ok,
  validationFailed,
} from "../../../utils/errors-handling";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";

export const deleteQuiz = async (req: any, res: Response) => {
  let params;
  const { errors, values } = validate(constraint(req));
  if (errors.length) {
    return validationFailed(res, errors);
  }
  params = values;

  if (!req.user) {
    return forbidden(res, "User id is required to delete quizzes");
  }

  try {
    const result = await Quiz.findOneAndDelete({
      _id: params.quizId,
      owner: req.user.id,
    });
    if (!result) {
      return notFound(
        res,
        "The quiz you're trying to delete has not been found"
      );
    }

    return ok(res, `The quiz ${result?._id} has been successfully deleted`);
  } catch (error) {
    return fail(res, error);
  }
};
