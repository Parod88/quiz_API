import request from "supertest";
import mongoose from "mongoose";
import { Quiz } from "../../../src/models/Quiz";
import { app, serverConnection } from "../../../src";
import { mongo } from "../../../src/config/config";

describe("Edit Quiz Endpoint Tests", () => {
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
      owner: "owner",
      title: "Test Quiz",
      description: "A quiz for testing purposes",
      instructions: "instructions for testing purposes",
    });
    quizId = quiz._id;
  });

  afterEach(async () => {
    await Quiz.deleteMany({});
  });

  it("should successfully update a quiz", async () => {
    const res = await request(app).put(`/api/quiz/${quizId}`).send({
      title: "Updated Test Quiz",
      description: "An updated quiz for testing purposes",
      instructions: "Updated instructions",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual("Updated Test Quiz");
  });

  it("should return a 400 error for validation failure", async () => {
    const res = await request(app).put(`/api/quiz/${quizId}`).send({});

    expect(res.statusCode).toEqual(400);
  });

  it("should return a 404 error for a non-existent quiz", async () => {
    const nonExistentQuizId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/quiz/${nonExistentQuizId}`).send({
      title: "Non-existent Quiz",
      description: "Non-existent description",
      instructions: "Non-existent instructions",
    });

    expect(res.statusCode).toEqual(404);
  });
});
