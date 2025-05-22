import { Request } from "express";
import mongoose from "mongoose";

const constraint = (req: Request) => ({
  sectionId: {
    value: req.params.sectionId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value && mongoose.isValidObjectId(value),
      errorMessage: "A valid Quiz ID is mandatory",
    },
  },
  name: {
    value: req.body.name,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "The name field should not be empty",
    },
  },
  quizId: {
    value: req.body.quizId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value && mongoose.isValidObjectId(value),
      errorMessage: "A valid Quiz ID is mandatory",
    },
  },
});

export default constraint;
