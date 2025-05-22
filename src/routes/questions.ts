import express from "express";

import { putEditQuestion } from "../controllers/questions/edit/edit-question";
import { postAddQuestion } from "../controllers/questions/add/add-question";
import { deleteQuestion } from "../controllers/questions/delete/delete-question";
import { getQuestionsFromSection } from "../controllers/questions/get-from-section/get-from-section";
import { getOneQuestion } from "../controllers/questions/get-one/get-one-question";

const router = express.Router();

//Questions routes
/**
 * @swagger
 *  api/question:
 *      post:
 *          summary: Add new question
 *          tags:
 *              - Question
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Question'
 *          responses:
 *              201:
 *                  description: Question info for question created
 *              400:
 *                  description: Mandatory fields are missing or wrongly typed
 *              401:
 *                  description: This user is not authorized to access this endpoint
 *              403:
 *                 description: Forbidden, user is not the owner of the quiz or there is already a question with the same order
 *              404:
 *                 description: Quiz or section not found
 *              500:
 *                  description: Internal server error
 */
router.post("/", postAddQuestion);

/**
 * @swagger
 * paths:
 *   /api/question/{questionId}:
 *     put:
 *       summary: Edit a question
 *       tags:
 *         - Question
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       responses:
 *         '200':
 *           description: Successfully updated the question
 *         '400':
 *           description: Validation error
 *         '404':
 *           description: Question not found
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - sectionId
 *         - quizId
 *         - question
 *         - type
 *       properties:
 *         sectionId:
 *           type: string
 *           description: The ID of the section to which the question belongs.
 *         quizId:
 *           type: string
 *           description: The ID of the quiz to which the question belongs.
 *         question:
 *           type: string
 *           description: The text of the question.
 *         info:
 *           type: string
 *           description: Additional information about the question.
 *         order:
 *           type: number
 *           description: The order of the question within its section.
 *         type:
 *           type: string
 *           enum:
 *             - SINGLE_CHOICE
 *             - MULTIPLE_CHOICE
 *             - TEXT
 *             - DATE
 *             - BOOLEAN
 *             - COMPOSED
 *           description: The type of the question.
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - option
 *             properties:
 *               option:
 *                 type: string
 *                 description: The text of the option.
 *               info:
 *                 type: string
 *                 description: Additional information about the option.
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Additional metadata for the option.
 *       example:
 *         sectionId: "5f8d04034b5a4620d8d0f4b3"
 *         quizId: "5f8d04034b5a4620d8d0f4b2"
 *         question: "What is the capital of France?"
 *         info: "This question is related to European capitals."
 *         order: 1
 *         type: "SINGLE_CHOICE"
 *         options:
 *           - option: "Paris"
 *             info: "The correct answer."
 *             metadata: {}
 *           - option: "Berlin"
 *             info: "A common incorrect answer."
 *             metadata: {}
 */
router.put("/:questionId", putEditQuestion);

/**
 * @swagger
 * paths:
 *   /api/question/{questionId}:
 *     delete:
 *       summary: Delete a question
 *       tags:
 *         - Question
 *       requestBody:
 *               required: true
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/Question'
 *       parameters:
 *         - in: path
 *           name: questionId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the question to delete
 *         - in: query
 *           name: quizId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the quiz containing the question
 *         - in: query
 *           name: sectionId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the section containing the question
 *       responses:
 *         '200':
 *           description: The question has been successfully deleted
 *         '400':
 *           description: Validation error
 *         '404':
 *           description: Question not found
 */
router.delete("/:questionId", deleteQuestion);

/**
 * @swagger
 * paths:
 *   /api/question:
 *     get:
 *       summary: Get all questions from a section
 *       tags:
 *         - Question
 *       parameters:
 *         - in: body
 *           name: quizId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the quiz containing the question
 *         - in: body
 *           name: sectionId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the section containing the questions
 *       responses:
 *         '200':
 *           description: A list containing all the questions from the section
 *         '400':
 *           description: Validation error
 *         '404':
 *           description: Question not found
 */
router.get("/", getQuestionsFromSection);

/**
 * @swagger
 * paths:
 *   /api/question/{questionId}:
 *     get:
 *       summary: Get a concrete question
 *       tags:
 *         - Question
 *       parameters:
 *         - in: path
 *           name: questionId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the question to get
 *         - in: body
 *           name: quizId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the quiz containing the question
 *         - in: body
 *           name: sectionId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the section containing the questions
 *       responses:
 *         '200':
 *           description: A concrete question
 *         '400':
 *           description: Validation error
 *         '404':
 *           description: Question not found
 */
router.get("/:questionId", getOneQuestion);

export default router;
