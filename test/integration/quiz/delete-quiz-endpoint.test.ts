import request from "supertest";
import mongoose from "mongoose";
import { Quiz } from "../../../src/models/Quiz";
import { app, serverConnection } from "../../../src";
import { mongo } from "../../../src/config/config";
import { authMock } from "../../../src/middlewares/authMock";
import { NextFunction } from "express";

const user = {
  id: "1e684e82-f501-4840-a1af-e397a4248270",
};
const nonOwnerUser = {
  id: "1e684e82-f501-4840-a1af-e397a4248271",
};

jest.mock("../../../src/middlewares/authMock");

describe("Delete Quiz Endpoint Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    serverConnection.close();
  });

  let quizId: any;

  beforeEach(async () => {
    const quiz = await Quiz.create({
      owner: user.id,
      title: "Test Quiz",
      description: "A quiz for testing purposes",
      instructions: "instructions for testing purposes",
    });
    quizId = quiz._id;
  });

  afterEach(async () => {
    await Quiz.deleteMany({});
  });

  it("should successfully delete a quiz", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app).delete(`/api/quiz/${quizId}`);
    expect(res.statusCode).toEqual(200);
    const responseBody = JSON.parse(res.text);

    expect(responseBody).toBe(
      `The quiz ${quizId} has been successfully deleted`
    );
  });
  it("should return a 404 error for a non-existent quiz", async () => {
    const nonExistentQuizId = new mongoose.Types.ObjectId();
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app).delete(`/api/quiz/${nonExistentQuizId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Not Found");
    expect(res.body.payload).toEqual(
      "The quiz you're trying to delete has not been found"
    );
  });

  it("should return a 404 error for a wrong given owner", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = nonOwnerUser;
        next();
      }
    );
    const res = await request(app).delete(`/api/quiz/${quizId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Not Found");
    expect(res.body.payload).toEqual(
      "The quiz you're trying to delete has not been found"
    );
  });
  it("should return a 400 error for missing user", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app).delete(`/api/quiz/${quizId}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual("Forbidden");
    expect(res.body.payload).toEqual("User id is required to delete quizzes");
  });
});
