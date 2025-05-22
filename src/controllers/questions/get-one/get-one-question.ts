import { Response } from "express";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";
import {
  fail,
  notFound,
  ok,
  unauthorized,
  validationFailed,
} from "../../../utils/errors-handling";
import { Quiz } from "../../../models/Quiz";
import { ObjectId } from "mongodb";
import { Question } from "../../../models/Question";

export const getOneQuestion = async (req: any, res: Response) => {
  let params;
  const { errors, values } = validate(constraint(req));
  if (errors.length) {
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
      sections: {
        $elemMatch: { $eq: ObjectId.createFromHexString(params.sectionId) },
      },
    });

    if (!quiz) {
      return notFound(res, "Quiz not found");
    }

    const question = await Question.findOne({
      _id: params.questionId,
      sectionId: params.sectionId,
    });
    if (!question) {
      return notFound(res, "Question or section not found");
    }
    return ok(res, question);
  } catch (error) {
    return fail(res, error);
  }
};
