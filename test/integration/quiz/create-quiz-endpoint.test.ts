import request from "supertest";

import { app, serverConnection } from "../../../src/index";
import { IQuiz, Quiz } from "../../../src/models/Quiz";
import mongoose from "mongoose";
import { mongo } from "../../../src/config/config";

describe("Create Quiz endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await Quiz.deleteMany();
    await mongoose.connection.close();
    serverConnection.close();
  });

  it("Request a Quiz Creation :: Happy Path", async () => {
    const quizReq: IQuiz = {
      owner: "1",
      title: "My first Quiz",
      description: "A quiz to test the API",
      instructions: "You should answer the questions",
    };

    const res = await request(app).post("/api/quiz").send(quizReq);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("owner");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("instructions");
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body).toHaveProperty("__v");
  });

  it("Request a Quiz Creation :: Missing owner", async () => {
    const wrongQuizReq: Omit<IQuiz, "owner"> = {
      title: "My first Quiz",
      description: "A quiz to test the API",
      instructions: "You should answer the questions",
    };
    const res = await request(app).post("/api/quiz").send(wrongQuizReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("owner");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe("Every Quiz needs an owner");
  });

  it("Request a Quiz Creation :: Missing title", async () => {
    const wrongQuizReq: Omit<IQuiz, "title"> = {
      owner: "My first Quiz",
      description: "A quiz to test the API",
      instructions: "You should answer the questions",
    };
    const res = await request(app).post("/api/quiz").send(wrongQuizReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("title");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "A title is mandatory for a Quiz"
    );
  });

  it("Request a Quiz Creation :: Missing description", async () => {
    const wrongQuizReq: Omit<IQuiz, "description"> = {
      owner: "My first Quiz",
      title: "A quiz to test the API",
      instructions: "You should answer the questions",
    };
    const res = await request(app).post("/api/quiz").send(wrongQuizReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("description");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The description field should not be empty"
    );
  });

  it("Request a Quiz Creation :: Missing instructions", async () => {
    const wrongQuizReq: Omit<IQuiz, "instructions"> = {
      owner: "My first Quiz",
      title: "A quiz to test the API",
      description: "You should answer the questions",
    };
    const res = await request(app).post("/api/quiz").send(wrongQuizReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("instructions");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The instructions field should not be empty"
    );
  });
});
