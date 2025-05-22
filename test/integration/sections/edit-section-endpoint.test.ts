import request from "supertest";
import mongoose from "mongoose";
import { Quiz } from "../../../src/models/Quiz";
import { app, serverConnection } from "../../../src";
import { mongo } from "../../../src/config/config";
import { Section } from "../../../src/models/Section";
import { authMock } from "../../../src/middlewares/authMock";
import { NextFunction } from "express";

const user = {
  id: "1e684e82-f501-4840-a1af-e397a4248270",
};

jest.mock("../../../src/middlewares/authMock");

describe("Edit Section Endpoint Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    serverConnection.close();
  });

  let quizId: any;
  let sectionId: any;
  let ownerId: string = user.id;
  const nonExistentSectionId = "D9BFDDBD6D6273F1E6FA3D1B";
  beforeEach(async () => {
    const quiz = await Quiz.create({
      owner: ownerId,
      title: "Test Quiz",
      description: "A quiz for testing purposes",
      instructions: "instructions for testing purposes",
    });
    quizId = quiz._id;
    const section = await Section.create({
      quizId: quizId,
      name: "My first Section",
    });
    sectionId = section._id;
  });

  afterEach(async () => {
    await Quiz.deleteMany({});
    await Section.deleteMany({});
  });

  it("should successfully update a section", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app).put(`/api/section/${sectionId}`).send({
      name: "Updated section name",
      quizId,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Updated section name");
  });

  it("should return a 400 error for validation failure", async () => {
    const res = await request(app).put(`/api/section/${sectionId}`).send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Validation Error");
    expect(res.body.payload[0].error_msg).toBe(
      "The name field should not be empty"
    );
  });

  it("should return a 404 error for a non-existent section or quiz", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app)
      .put(`/api/section/${nonExistentSectionId}`)
      .send({
        name: "Updated section name",
        quizId,
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toEqual("Section not found");
  });

  it("should return a 401 error for a missing user", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app).put(`/api/section/${sectionId}`).send({
      name: "Updated section name",
      quizId,
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toEqual(
      "This user is not authorized to access this endpoint"
    );
  });
});
