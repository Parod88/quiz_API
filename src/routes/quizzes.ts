import express from "express";
import { postCreateQuiz } from "../controllers/quiz/create/create-quiz";
import { getAllQuizzes } from "../controllers/quiz/get-all/get-all";
import { putEditQuiz } from "../controllers/quiz/edit/edit-quiz";
import { deleteQuiz } from "../controllers/quiz/delete/delete-quiz";
import { getOneQuiz } from "../controllers/quiz/get-one/get-one";

const router = express.Router();

//Quizzes routes
/**
 * @swagger
 *  api/quiz:
 *      post:
 *          summary: Create new Quiz
 *          tags:
 *              - Quiz
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          responses:
 *              201:
 *                  description: Quiz info for quiz created
 *              400:
 *                  description: Mandatory fields are missing or wrongly typed
 *              401:
 *                  description: The owner doesn't exist in the system
 *              500:
 *                  description: Internal server error
 */
router.post("/", postCreateQuiz);

/**
 * @swagger
 *  api/quiz:
 *      get:
 *          summary: Get all quizzes from a specific owner
 *          tags:
 *              - Quiz
 *          responses:
 *              200:
 *                  description: Successfully retrieved list of quizzes
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Quiz'
 *              400:
 *                  description: Bad request, possibly due to invalid format of ownerId
 *              404:
 *                  description: Owner not found
 *              500:
 *                  description: Internal server error
 */
router.get("/", getAllQuizzes);

/**
 * @swagger
 *  api/quiz/{quizId}:
 *      get:
 *          summary: Get a specific quiz by its ID
 *          tags:
 *              - Quiz
 *          parameters:
 *            - in: path
 *              name: quizId
 *              required: true
 *              schema:
 *                type: string
 *              description: The ID of the quiz to retrieve
 *          responses:
 *              200:
 *                  description: Successfully retrieved the quiz
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Quiz'
 *              400:
 *                  description: Bad request, validation failed
 *              403:
 *                  description: Forbidden, user is not the owner of the quiz
 *              404:
 *                  description: Quiz not found
 *              500:
 *                  description: Internal server error
 */
router.get("/:quizId", getOneQuiz);

/**
 * @swagger
 *  api/quiz/{quizId}:
 *      delete:
 *          summary: Delete a specific quiz
 *          tags:
 *              - Quiz
 *          parameters:
 *            - in: path
 *              name: quizId
 *              required: true
 *              schema:
 *                type: string
 *              description: The ID of the quiz to delete
 *          responses:
 *              200:
 *                  description: Successfully deleted the quiz
 *              400:
 *                  description: Bad request, validation error
 *              403:
 *                  description: Forbidden, user is not the owner of the quiz
 *              404:
 *                  description: Quiz not found
 *              500:
 *                  description: Internal server error
 */
router.delete("/:quizId", deleteQuiz);

/**
 * @swagger
 *  api/quiz/{quizId}:
 *      put:
 *          summary: Edit a specific quiz
 *          tags:
 *              - Quiz
 *          parameters:
 *            - in: path
 *              name: quizId
 *              required: true
 *              schema:
 *                type: string
 *                format: uuid
 *              description: The UUID of the quiz to be edited
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          responses:
 *              200:
 *                  description: Successfully updated the quiz
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Quiz'
 *              400:
 *                  description: Bad request, possibly due to invalid format of quizId or invalid request body
 *              404:
 *                  description: Quiz not found
 *              500:
 *                  description: Internal server error
 */
router.put("/:quizId", putEditQuiz);

export default router;
