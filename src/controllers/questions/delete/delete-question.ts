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
import { Question } from "../../../models/Question";
import { ObjectId } from "mongodb";
import { Section } from "../../../models/Section";

export const deleteQuestion = async (req: any, res: Response) => {
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
      sections: {
        $elemMatch: { $eq: ObjectId.createFromHexString(params.sectionId) },
      },
    });
    if (!quiz) {
      return notFound(res, "Quiz not found");
    }

    const deletedQuestion = await Question.findOneAndDelete({
      _id: params.questionId,
      sectionId: params.sectionId,
    });

    if (!deletedQuestion) {
      return notFound(res, "Question not found");
    }

    await Section.updateOne(
      { _id: params.sectionId },
      { $pull: { questions: params.questionId } }
    );

    await Question.updateMany(
      { sectionId: params.sectionId, order: { $gt: deletedQuestion.order } },
      { $inc: { order: -1 } }
    );

    return ok(
      res,
      `The question ${deletedQuestion?._id} has been succesfully deleted`
    );
  } catch (error) {
    return fail(res, error);
  }
};
