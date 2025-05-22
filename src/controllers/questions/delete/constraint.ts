import { Request } from "express";
import mongoose from "mongoose";

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
});

export default constraint;
