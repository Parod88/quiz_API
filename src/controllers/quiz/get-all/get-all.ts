import { Response } from "express";
import { fail, ok, unauthorized } from "../../../utils/errors-handling";
import { Quiz } from "../../../models/Quiz";

export const getAllQuizzes = async (req: any, res: Response) => {
  if (!req.user) {
    return unauthorized(
      res,
      "This user is not authorized to access this endpoint"
    );
  }
  try {
    const quizzes = await Quiz.find({ owner: req.user.id });
    return ok(res, quizzes);
  } catch (error) {
    return fail(res, error);
  }
};
