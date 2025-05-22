import express from "express";

import quizRouter from "./quizzes";
import sectionRouter from "./sections";
import questionRouter from "./questions";
import recordRouter from "./records";

const router = express.Router();

router.use("/api/quiz", quizRouter);
router.use("/api/section", sectionRouter);
router.use("/api/question", questionRouter);
router.use("/api/record", recordRouter);

export default router;

/**
 * @swagger
 * components:
 *      schemas:
 *          Quiz:
 *              type: object
 *              properties:
 *                  owner:
 *                      type: string
 *                      description: The owner of the Quiz
 *                  title:
 *                      type: string
 *                      description: The title of the Quiz
 *                  description:
 *                      type: string
 *                      description: The description of the Quiz
 *                  instructions:
 *                      type: string
 *                      description: The instructions of the Quiz
 *              required:
 *                  - owner
 *                  - title
 *                  - description
 *                  - instructions
 *          Section:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: The section's name
 *                  quizId:
 *                      type: string
 *                      description: The ID of the quiz containing the section
 *              required:
 *                  - name
 *                  - quizId
 *          Question:
 *              type: object
 *              properties:
 *                  sectionId:
 *                      type: string
 *                      description: The ID of the section to which the question belongs.
 *                  quizId:
 *                      type: string
 *                      description: The ID of the quiz to which the question belongs.
 *                  question:
 *                      type: string
 *                      description: The text of the question.
 *                  info:
 *                      type: string
 *                      description: Additional information about the question.
 *                  order:
 *                      type: number
 *                      description: The order of the question within its section.
 *                  type:
 *                      type: string
 *                      enum:
 *                          - SINGLE_CHOICE
 *                          - MULTIPLE_CHOICE
 *                          - TEXT
 *                          - DATE
 *                          - BOOLEAN
 *                          - COMPOSED
 *                      description: The type of the question.
 *                  options:
 *                      type: array
 *                      items:
 *                          type: object
 *                          required:
 *                              - option
 *                          properties:
 *                              option:
 *                                  type: string
 *                                  description: The text of the option.
 *                              info:
 *                                  type: string
 *                                  description: Additional information about the option.
 *                              metadata:
 *                                  type: object
 *                                  additionalProperties: true
 *                                  description: Additional metadata for the option.
 *              required:
 *                  - sectionId
 *                  - quizId
 *                  - question
 *                  - type
 *          Record:
 *             type: object
 *             properties:
 *                 progress:
 *                     type: array
 *                     description: The Schema of the answer to which the Record belongs.
 *                     items:
 *                         $ref: '#/components/schemas/Answer'
 *                 status:
 *                     type: string
 *                     description: The status of the record.
 *                     enum:
 *                         - PENDING
 *                         - COMPLETED
 *                         default: PENDING
 *          Answer:
 *              type: object
 *              properties:
 *                  question:
 *                      type: string
 *                      description: "ObjectId reference to a Question document"
 *                  value:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Option' 
 *                  required:
 *                       - question
 */
