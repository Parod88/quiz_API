import { Response } from "express";
import {
  created,
  fail,
  notFound,
  unauthorized,
  validationFailed,
} from "../../../utils/errors-handling";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";
import { Quiz } from "../../../models/Quiz";
import { Question } from "../../../models/Question";
import { ObjectId } from "mongodb";

export const putEditQuestion = async (req: any, res: Response) => {
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
      return notFound(res, "Quiz not found or invalid Quiz ID");
    }

    const editedQuestion = await Question.findOneAndUpdate(
      { _id: params.questionId, sectionId: params.sectionId },
      params,
      { new: true, runValidators: true }
    );

    if (!editedQuestion) {
      return notFound(
        res,
        "Section or Question not found or invalid Section ID"
      );
    }
    return created(res, editedQuestion);
  } catch (error) {
    return fail(res, error);
  }
};
