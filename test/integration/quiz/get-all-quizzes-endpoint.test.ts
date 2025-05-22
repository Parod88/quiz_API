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

describe("Get All Quizzes endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    serverConnection.close();
  });

  const mockQuiz = {
    owner: user.id,
    title: "Test Quiz",
    description: "A quiz for testing",
    instructions: "Answer the questions",
  };

  beforeEach(async () => {
    await new Quiz(mockQuiz).save();
  });

  afterEach(async () => {
    await Quiz.deleteMany({ owner: mockQuiz.owner });
  });

  it("should return all the user's quizzes", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app).get(`/api/quiz`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return an empty list if there are no quizzes with that owner = req.user.id", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = { id: "1e684e82-f501-4840-a1af-e397a4248271" };
        next();
      }
    );
    const res = await request(app).get(`/api/quiz`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should return 401 for a non valid Id", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app).get("/api/quiz");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized error");
    expect(res.body.payload).toBe(
      "This user is not authorized to access this endpoint"
    );
  });

  it("should handle errors gracefully", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    jest.spyOn(Quiz, "find").mockImplementation(() => {
      throw new Error("Database query failed");
    });

    const res = await request(app).get(`/api/quiz`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Internal Error");
    expect(res.body.payload).toBe("Database query failed");

    (Quiz.find as jest.Mock).mockRestore();
  });
});
