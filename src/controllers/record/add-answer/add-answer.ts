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
import { Answer } from "../../../models/Answer";

export const postAddAnswer = async (req: any, res: Response) => {
    let params;
  const { errors, values } = validate(constraint(req));
  if (errors.length) {
    return validationFailed(res, errors);
  }
  params = values;
  console.log(params);

  if (!req.user) {
    return unauthorized(
      res,
      "This user is not authorized to access this endpoint"
    );
  }
  
  try {
    const quiz = await Quiz.findOne({
        _id: params.quizId,
    })

    if(!quiz) {
        return notFound(res, "Quiz or Section not found or invalid ID")
    }

    const question = await Question.find({
        _id: params.questionId,
        quizId: params.quizId,
    })
    if(!question) {
        return notFound(res, "Question not found or invalid ID")
    }

    const addAnswer = await Answer.create({
      question: params.questionId,
      value: params.options
    });
    return created(res, addAnswer)

  } catch (error) {
    return fail(res, error);
  }
}