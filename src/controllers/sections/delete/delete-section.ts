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
import constraint from "./constraint";
import { Section } from "../../../models/Section";

export const deleteSection = async (req: any, res: Response) => {
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
      return notFound(res, "Sorry, there is no Quiz matching this quizId");
    }

    const deletedSection = await Section.findByIdAndDelete(params.sectionId);
    if (!deletedSection) {
      return notFound(
        res,
        "Sorry, there is no Section matching this sectionId"
      );
    }

    await Quiz.updateOne(
      { _id: params.quizId },
      { $pull: { sections: params.sectionId } }
    );
    return ok(
      res,
      `The section "${deletedSection?.name}" has been succesfully deleted`
    );
  } catch (error) {
    return fail(res, error);
  }
};
