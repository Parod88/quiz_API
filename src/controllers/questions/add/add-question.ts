import { Response } from "express";
import {
  created,
  fail,
  forbidden,
  notFound,
  unauthorized,
  validationFailed,
} from "../../../utils/errors-handling";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";
import { Section } from "../../../models/Section";
import { Quiz } from "../../../models/Quiz";
import { Question } from "../../../models/Question";
import { ObjectId } from "mongodb";

export const postAddQuestion = async (req: any, res: Response) => {
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
      return notFound(res, "Quiz or Section not found or invalid ID");
    }

    const question = await Question.find({
      sectionId: params.sectionId,
      order: params.order,
    });

    if (question.length > 0) {
      return forbidden(res, "Question with this order already exists");
    }

    const addQuestion = await Question.create(params);
    await Section.updateOne(
      {
        _id: params.sectionId,
      },
      {
        $push: { questions: addQuestion._id },
      }
    );

    return created(res, addQuestion);
  } catch (error) {
    return fail(res, error);
  }
};
