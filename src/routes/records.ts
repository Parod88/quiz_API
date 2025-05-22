import express from "express";

import { postAddAnswer } from "../controllers/record/add-answer/add-answer";

const router = express.Router();

// Record routes

/**
 * @swagger
 *  api/record/answer:
 *      post:
 *          summary: Add new answer
 *          tags:
 *              - Answer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Answer'
 *          responses:
 *              201:
 *                  description: Answer info for answer created
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

router.post("/answer", postAddAnswer)

export default router;