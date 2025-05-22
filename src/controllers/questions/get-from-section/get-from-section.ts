import { Response } from "express";
import { Quiz } from "../../../models/Quiz";
import {
  fail,
  notFound,
  ok,
  unauthorized,
  validationFailed,
} from "../../../utils/errors-handling";
import { validate } from "../../../utils/validate";
import { Question } from "../../../models/Question";
import constraint from "./constraint";

export const getQuestionsFromSection = async (req: any, res: Response) => {
  let params;
  const { errors, values } = validate(constraint(req));
  if (errors.length > 0) {
    return validationFailed(res, errors);
  }
  params = values;

  if (!req.user) {
    return unauthorized(
      res,
      "This user is not authorized to access this endpoint"
    );
  }

  try {
    const quiz = await Quiz.findOne({
      _id: params.quizId,
      owner: req.user.id,
    });
    if (!quiz) {
      return notFound(res, "Quiz not found");
    }

    const questions = await Question.find({
      sectionId: params.sectionId,
      quizId: params.quizId,
    }).sort({ order: 1 });

    if (questions.length === 0) {
      return notFound(res, "No questions found for this section");
    }

    return ok(res, questions);
  } catch (error) {
    return fail(res, error);
  }
};
