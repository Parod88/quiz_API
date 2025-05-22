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
  sectionId: {
    value: req.body.sectionId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value && mongoose.isValidObjectId(value),
      errorMessage: "Section ID is mandatory and must be in a valid format",
    },
  },
  questionId: {
    value: req.params.questionId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value && mongoose.isValidObjectId(value),
      errorMessage: "Question ID is mandatory and must be in a valid format",
    },
  },
  question: {
    value: req.body.question,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "The question field should not be empty",
    },
  },
  info: {
    value: req.body.info,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "The info field should not be empty",
    },
  },
  order: {
    value: req.body.order,
    optional: false,
    validator: {
      isValid: (value: number) => !!value,
      errorMessage: "The order field should not be empty",
    },
  },
  type: {
    value: req.body.type,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "The type field should not be empty",
    },
  },
  options: {
    value: req.body.options,
    optional: false,
    validator: {
      isValid: (value: IOption[]) => !!value && value.length >= 1,
      errorMessage:
        "The options field should not be empty and must have at least 1 options",
    },
  },
});

export default constraint;
