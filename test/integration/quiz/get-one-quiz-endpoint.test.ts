import request from "supertest";
import { app, serverConnection } from "../../../src/index";
import mongoose from "mongoose";
import { mongo } from "../../../src/config/config";
import { Quiz } from "../../../src/models/Quiz";
import { authMock } from "../../../src/middlewares/authMock";
import { NextFunction } from "express";

const user = {
  id: "1e684e82-f501-4840-a1af-e397a4248270",
};

jest.mock("../../../src/middlewares/authMock");

describe("Get a single quiz endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    serverConnection.close();
  });

  let quizId: any;

  const mockQuiz = {
    owner: user.id,
    title: "Test Quiz",
    description: "A quiz for testing purposes",
    instructions: "Answer the questions",
  };

  const wrongId = "5f8d0d55b54764421b7156bc";

  beforeEach(async () => {
    const quiz = await new Quiz(mockQuiz).save();
    quizId = quiz._id;
  });

  afterEach(async () => {
    await Quiz.deleteMany({ owner: mockQuiz.owner });
  });

  it("should return a specific quiz", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app).get(`/api/quiz/${quizId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("owner", user.id);
    expect(res.body).toHaveProperty("title", "Test Quiz");
    expect(res.body).toHaveProperty(
      "description",
      "A quiz for testing purposes"
    );
    expect(res.body).toHaveProperty("instructions", "Answer the questions");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body).toHaveProperty("__v", 0);
  });

  it("should return a 404 error for not found quiz or wrong given owner", async () => {
    const res = await request(app).get(`/api/quiz/${wrongId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Not Found");
    expect(res.body.payload).toEqual(
      "The quiz you're trying to get has not been found"
    );
  });

  it("should fail if user id is not provided", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app).get(`/api/quiz/${quizId}`);
    expect(res.status).toEqual(401);
    expect(res.body.payload).toEqual(
      "This user is not authorized to access this endpoint"
    );
  });
});
