import request from "supertest";
import { app, serverConnection } from "../../../src/index";
import { Quiz } from "../../../src/models/Quiz";
import mongoose from "mongoose";
import { mongo } from "../../../src/config/config";
import { ISection } from "../../../src/models/Section";
import { authMock } from "../../../src/middlewares/authMock";
import { NextFunction } from "express";

const user = {
  id: "1e684e82-f501-4840-a1af-e397a4248270",
};

jest.mock("../../../src/middlewares/authMock");

describe("Create Section endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await Quiz.deleteMany();
    await mongoose.connection.close();
    serverConnection.close();
  });

  let quizId: any;
  let wrongQuizId: any;
  let wrongOwnerId: any = "wrongOwnerId";

  beforeEach(async () => {
    const quiz = await Quiz.create({
      owner: user.id,
      title: "Test Quiz",
      description: "A quiz for testing purposes",
      instructions: "instructions for testing purposes",
    });
    quizId = quiz._id;
    const wrongQuiz = await Quiz.create({
      owner: wrongOwnerId,
      title: "Wrong Quiz",
      description: "A wrong quiz for testing purposes",
      instructions: "wrong instructions for testing purposes",
    });
    wrongQuizId = wrongQuiz._id;
  });

  afterEach(async () => {
    await Quiz.deleteMany({});
  });

  it("Request a Section Creation :: Happy Path", async () => {
    const sectionReq: ISection = {
      quizId: quizId,
      name: "My first Section",
    };
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app).post(`/api/section`).send(sectionReq);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("quizId");
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body).toHaveProperty("__v");
  });

  it("Request a Section Creation :: Missing name", async () => {
    const wrongSectionReq: Omit<ISection, "name"> = {
      quizId: quizId,
    };
    const res = await request(app).post(`/api/section`).send(wrongSectionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("name");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The name field should not be empty"
    );
  });

  it("Request a Section Creation :: Wrong Quiz ID", async () => {
    const sectionReq: ISection = {
      quizId: wrongQuizId,
      name: "testing section",
    };
    const res = await request(app).post(`/api/section`).send(sectionReq);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toBe("Quiz not found or wrong owner");
  });

  it("Request a Section Creation :: Missing Owner", async () => {
    const sectionReq: ISection = {
      quizId: quizId,
      name: "testing section",
    };
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app).post(`/api/section`).send(sectionReq);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toBe(
      "This user is not authorized to access this endpoint"
    );
  });
});
