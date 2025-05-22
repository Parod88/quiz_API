import request from "supertest";
import { app, serverConnection } from "../../../src/index";
import mongoose from "mongoose";
import { mongo } from "../../../src/config/config";
import { Question, QuestionType } from "../../../src/models/Question";
import { Quiz } from "../../../src/models/Quiz";
import { Section } from "../../../src/models/Section";
import { authMock } from "../../../src/middlewares/authMock";
import { NextFunction } from "express";

const user = {
  id: "1e684e82-f501-4840-a1af-e397a4248270",
};

jest.mock("../../../src/middlewares/authMock");

describe("Get Questions from a section", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await Question.deleteMany();
    await mongoose.connection.close();
    serverConnection.close();
  });

  let quizId: any;
  let sectionId: any;
  let section2Id: any;
  let nonExistentId: any = "668F6A918A3FC35DB4DFB1F2";
  let wrongId = "wrongId" as any;

  beforeEach(async () => {
    const quiz = await Quiz.create({
      owner: user.id,
      title: "Test Quiz",
      description: "A quiz for testing purposes",
      instructions: "instructions for testing purposes",
      sections: [],
    });
    quizId = quiz._id;

    const section = await Section.create({
      quizId: quizId,
      name: "My first Section",
      questions: [],
    });
    sectionId = section._id;

    const section2 = await Section.create({
      quizId: quizId,
      name: "My first Section",
      questions: [],
    });
    section2Id = section2._id;

    const question = await Question.create({
      quizId: quizId,
      sectionId: sectionId,
      question: "The question to be answered",
      info: "Info paragraph",
      type: QuestionType.COMPOSED,
      order: 1,
      options: [
        {
          option: "Wording of the option",
          info: "Info about the option to clarify",
          metadata: {
            type: "test",
          },
        },
      ],
    });

    const question3 = await Question.create({
      quizId: quizId,
      sectionId: sectionId,
      question: "The third question to be answered",
      info: "Info paragraph",
      type: QuestionType.COMPOSED,
      order: 3,
      options: [
        {
          option: "Wording of the option",
          info: "Info about the option to clarify",
          metadata: {
            type: "test",
          },
        },
      ],
    });

    const question2 = await Question.create({
      quizId: quizId,
      sectionId: sectionId,
      question: "The second question to be answered",
      info: "Info paragraph",
      type: QuestionType.COMPOSED,
      order: 2,
      options: [
        {
          option: "Wording of the option",
          info: "Info about the option to clarify",
          metadata: {
            type: "test",
          },
        },
      ],
    });

    await Quiz.findByIdAndUpdate(quizId, { $push: { sections: sectionId } });
    await Section.findByIdAndUpdate(sectionId, {
      $push: {
        questions: { $each: [question._id, question2._id, question3._id] },
      },
    });
  });
  afterEach(async () => {
    await Quiz.deleteMany({});
    await Section.deleteMany({});
    await Question.deleteMany({});
  });

  it("Get all Questions from a section :: Happy Path", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );

    const res = await request(app).get(`/api/question`).send({
      quizId: quizId,
      sectionId: sectionId,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].question).toBe("The question to be answered");
    expect(res.body[1].question).toBe("The second question to be answered");
    expect(res.body[2].question).toBe("The third question to be answered");
  });

  it("Get all Questions from a section :: Wrong format or missing quizId", async () => {
    const res = await request(app)
      .get(`/api/question`)
      .send({ quizId: wrongId, sectionId: sectionId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0].error_msg).toBe(
      "Quiz ID is mandatory and must be in a valid format"
    );
  });

  it("Get all Questions from a section :: Wrong format or missing sectionId", async () => {
    const res = await request(app)
      .get(`/api/question`)
      .send({ quizId: quizId, sectionId: wrongId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0].error_msg).toBe(
      "Section ID is mandatory and must be in a valid format"
    );
  });

  it("Get all Questions from a section :: Wrong or missing user", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app)
      .get(`/api/question`)
      .send({ quizId: quizId, sectionId: sectionId });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Unauthorized error");
    expect(res.body.payload).toBe(
      "This user is not authorized to access this endpoint"
    );
  });

  it("Get all Questions from a section :: Not found quiz ID", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app)
      .get(`/api/question`)
      .send({ quizId: nonExistentId, sectionId: sectionId });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Not Found");
    expect(res.body.payload).toBe("Quiz not found");
  });

  it("Get all Questions from a section :: Not found questions for this section", async () => {
    const res = await request(app).get(`/api/question`).send({
      quizId: quizId,
      sectionId: section2Id,
    });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Not Found");
    expect(res.body.payload).toBe("No questions found for this section");
  });

  it("should handle errors gracefully", async () => {
    jest.spyOn(Question, "find").mockImplementation(() => {
      throw new Error("Database query failed");
    });

    const res = await request(app).get(`/api/question`).send({
      quizId: quizId,
      sectionId: sectionId,
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Internal Error");
    expect(res.body.payload).toBe("Database query failed");

    (Question.find as jest.Mock).mockRestore();
  });
});
