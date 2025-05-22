import { Request } from "express";
import mongoose from "mongoose";

const constraint = (req: Request) => ({
  quizId: {
    value: req.params.quizId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value && mongoose.isValidObjectId(value),
      errorMessage: "A valid Quiz ID is mandatory",
    },
  },
});

export default constraint;
