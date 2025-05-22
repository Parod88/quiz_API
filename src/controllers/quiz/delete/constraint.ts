import { Request } from "express";

const constraint = (req: Request) => ({
  quizId: {
    value: req.params.quizId,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "Quiz ID is mandatory",
    },
  },
});

export default constraint;
