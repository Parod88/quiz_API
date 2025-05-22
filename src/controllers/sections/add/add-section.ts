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
import { Section } from "../../../models/Section";
import { Quiz } from "../../../models/Quiz";

export const postAddSection = async (req: any, res: Response) => {
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
    const quiz = await Quiz.findOne({ _id: params.quizId, owner: req.user.id });

    if (!quiz) {
      return notFound(res, "Quiz not found or wrong owner");
    }

    const newSection = await Section.create(params);
    await Quiz.updateOne(
      { _id: params.quizId },
      { $push: { sections: newSection._id } }
    );
    return created(res, newSection);
  } catch (error) {
    return fail(res, error);
  }
};
