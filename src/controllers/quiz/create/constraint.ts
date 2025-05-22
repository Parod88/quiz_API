import { Request } from "express";

const constraint = (req: Request) => ({
  owner: {
    value: req.body.owner,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "Every Quiz needs an owner",
    },
  },
  title: {
    value: req.body.title,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "A title is mandatory for a Quiz",
    },
  },
  description: {
    value: req.body.description,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "The description field should not be empty",
    },
  },
  instructions: {
    value: req.body.instructions,
    optional: false,
    validator: {
      isValid: (value: string) => !!value,
      errorMessage: "The instructions field should not be empty",
    },
  },
});

export default constraint;
