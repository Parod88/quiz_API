import { Response } from "express";
import {
  fail,
  notFound,
  ok,
  unauthorized,
  validationFailed,
} from "../../../utils/errors-handling";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";
import { Section } from "../../../models/Section";
import { Quiz } from "../../../models/Quiz";

export const putEditSection = async (req: any, res: Response) => {
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
    });

    if (!quiz) {
      return notFound(res, "the quiz of this section was not found");
    }

    const updatedSection = await Section.findOneAndUpdate(
      { _id: params.sectionId },
      { name: params.name },
      { new: true, runValidators: true }
    );
    if (!updatedSection) {
      return notFound(res, "Section not found");
    }
    return ok(res, updatedSection);
  } catch (error) {
    return fail(res, error);
  }
};
