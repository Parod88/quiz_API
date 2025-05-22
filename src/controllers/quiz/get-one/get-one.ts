import { Response } from "express";
import {
  fail,
  notFound,
  ok,
  unauthorized,
  validationFailed,
} from "../../../utils/errors-handling";
import { Quiz } from "../../../models/Quiz";
import { validate } from "../../../utils/validate";
import constraint from "./constraint";
import { ObjectId } from "mongodb";

export const getOneQuiz = async (req: any, res: Response) => {
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
    const quiz = await Quiz.aggregate([
      {
        $match: {
          _id: ObjectId.createFromHexString(params.quizId),
          owner: req.user.id,
        },
      },
      {
        $lookup: {
          from: "sections",
          let: { quizId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$quizId", "$$quizId"] },
              },
            },
            {
              $lookup: {
                from: "questions",
                let: { sectionId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$sectionId", "$$sectionId"] },
                    },
                  },
                ],
                as: "questions",
              },
            },
          ],
          as: "sections",
        },
      },
    ]);

    if (!quiz.length) {
      return notFound(res, "The quiz you're trying to get has not been found");
    }
    return ok(res, quiz[0]);
  } catch (error) {
    return fail(res, error);
  }
};
