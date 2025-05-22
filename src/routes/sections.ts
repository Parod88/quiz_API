import express from "express";

import { deleteSection } from "../controllers/sections/delete/delete-section";
import { putEditSection } from "../controllers/sections/edit/edit-section";
import { postAddSection } from "../controllers/sections/add/add-section";

const router = express.Router();

//Sections routes
/**
 * @swagger
 *  api/section:
 *      post:
 *          summary: Add a section to a specific quiz
 *          tags:
 *              - Section
 *          parameters:
 *            - in: body
 *              name: quizId
 *              required: true
 *              schema:
 *                type: string
 *              description: The ID of the quiz to which the section will be added
 *            - in: body
 *              name: name
 *              required: true
 *              schema:
 *                type: string
 *              description: The name of the section
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: The name of the section
 *                              quizId:
 *                                  type: string
 *                                  description: The ID of the quiz to which the section will be added
 *          responses:
 *              201:
 *                  description: Successfully added the section
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      description: The ID of the newly created section
 *                                  name:
 *                                      type: string
 *                                      description: The name of the newly created section
 *                                  quizId:
 *                                      type: string
 *                                      description: The ID of the quiz to which the section was added
 *              400:
 *                  description: Bad request, possibly due to invalid format of quizId or invalid request body
 *              403:
 *                  description: Forbidden, user is not the owner of the quiz
 *              404:
 *                  description: Quiz not found
 *              500:
 *                  description: Internal server error
 */
router.post("/", postAddSection);

/**
 * @swagger
 *  api/section/{sectionId}:
 *      put:
 *          summary: Edit a section within a specific quiz
 *          tags:
 *              - Section
 *          parameters:
 *            - in: path
 *              name: sectionId
 *              required: true
 *              schema:
 *                type: string
 *              description: The ID of the section to be edited
 *            - in: body
 *              name: name
 *              required: true
 *              schema:
 *                type: string
 *              description: The new name of the section
 *            - in: body
 *              name: quizId
 *              required: true
 *              schema:
 *                type: string
 *              description: The ID of the quiz to which the section belongs
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: The edited name of the section
 *                              quizId:
 *                                  type: string
 *                                  description: The ID of the quiz to which the section belongs
 *          responses:
 *              201:
 *                  description: Successfully added the section
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      description: The ID of the edited section
 *                                  name:
 *                                      type: string
 *                                      description: The edited name of the section
 *                                  quizId:
 *                                      type: string
 *                                      description: The ID of the quiz to which the section belongs
 *              400:
 *                  description: Bad request, possibly due to invalid format of sectionId or invalid request body
 *              403:
 *                  description: Forbidden, user is not the owner of the section
 *              404:
 *                  description: Section not found
 *              500:
 *                  description: Internal server error
 */
router.put("/:sectionId", putEditSection);

/**
 * @swagger
 *  api/section/{sectionId}:
 *      delete:
 *          summary: Delete a section from a specific quiz
 *          tags:
 *              - Section
 *          parameters:
 *            - in: path
 *              name: quizId
 *              required: true
 *              schema:
 *                type: string
 *              description: The ID of the quiz from which the section will be deleted
 *            - in: path
 *              name: sectionId
 *              required: true
 *              schema:
 *                type: string
 *              description: The ID of the section to be deleted
 *          responses:
 *              200:
 *                  description: Successfully deleted the section
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      description: A confirmation message stating the section has been successfully deleted
 *              400:
 *                  description: Bad request, possibly due to missing or invalid format of quizId or sectionId
 *              403:
 *                  description: Forbidden, user is not the owner of the quiz
 *              404:
 *                  description: Quiz or section not found
 *              500:
 *                  description: Internal server error
 */
router.delete("/:sectionId", deleteSection);

export default router;
