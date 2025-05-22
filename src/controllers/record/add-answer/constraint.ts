import { Request } from "express";
import mongoose from "mongoose";
import { IOption } from "../../../models/Question";

const constraint = (req: Request) => ({
  quizId: {
    value: req.body.quizId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value && mongoose.isValidObjectId(value),
      errorMessage: "Quiz ID is mandatory and must be in a valid format",
    },
  },
  questionId: {
    value: req.body.questionId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value && mongoose.isValidObjectId(value),
      errorMessage: "Question ID is mandatory and must be in a valid format",
    },
  },
  options: {
    value: req.body.options,
    optional: false,
    validator: {
      isValid: (value: IOption[]) => !!value && value.length >= 1 && !!value[0].option && !!value[0].info,
      errorMessage:
        "The options field should not be empty and must have at least 1 options with the properties 'option' and 'info'",
    },
  },
});

export default constraint;