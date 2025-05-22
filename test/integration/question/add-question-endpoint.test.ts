import request from "supertest";

import { app, serverConnection } from "../../../src/index";
import mongoose from "mongoose";
import { mongo } from "../../../src/config/config";
import {
  IQuestion,
  Question,
  QuestionType,
} from "../../../src/models/Question";
import { Quiz } from "../../../src/models/Quiz";
import { Section } from "../../../src/models/Section";
import { NextFunction } from "express";
import { authMock } from "../../../src/middlewares/authMock";

const user = {
  id: "1e684e82-f501-4840-a1af-e397a4248270",
};

jest.mock("../../../src/middlewares/authMock");

describe("Create Question endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    serverConnection.close();
  });

  let quizId: any;
  let sectionId: any;
  let questionReq: IQuestion;

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
    await Quiz.findByIdAndUpdate(quizId, { $push: { sections: sectionId } });
  });

  afterEach(async () => {
    await Quiz.deleteMany({});
    await Section.deleteMany({});
    await Question.deleteMany({});
  });

  it("Request a Question Creation :: Happy Path", async () => {
    questionReq = {
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
    };
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );

    const res = await request(app).post(`/api/question`).send(questionReq);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("quizId");
    expect(res.body).toHaveProperty("sectionId");
    expect(res.body).toHaveProperty("question");
    expect(res.body).toHaveProperty("info");
    expect(res.body).toHaveProperty("order");
    expect(res.body).toHaveProperty("type");
    expect(res.body).toHaveProperty("options");
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body).toHaveProperty("__v");
  });

  it("Request a Question Creation :: Wrong quiz ID", async () => {
    const wrongQuestionReq: IQuestion = {
      quizId: "wrongId" as any,
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
    };

    const res = await request(app).post(`/api/question`).send(wrongQuestionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("quizId");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "Quiz ID is mandatory and must be in a valid format"
    );
  });

  it("Request a Question Creation :: Missing sectionId", async () => {
    const wrongQuestionReq: Omit<IQuestion, "sectionId"> = {
      quizId: quizId,
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
    };
    const res = await request(app).post(`/api/question`).send(wrongQuestionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("sectionId");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "Section ID is mandatory and must be in a valid format"
    );
  });

  it("Request a Question Creation :: Missing question", async () => {
    const wrongQuestionReq: Omit<IQuestion, "question"> = {
      quizId: quizId,
      sectionId,
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
    };
    const res = await request(app).post(`/api/question`).send(wrongQuestionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("question");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The question field should not be empty"
    );
  });

  it("Request a Question Creation :: Missing info", async () => {
    const wrongQuestionReq: Omit<IQuestion, "info"> = {
      quizId: quizId,
      sectionId,
      question: "The question to be answered",
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
    };
    const res = await request(app).post(`/api/question`).send(wrongQuestionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("info");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The info field should not be empty"
    );
  });

  it("Request a Question Creation :: Missing type", async () => {
    const wrongQuestionReq: Omit<IQuestion, "type"> = {
      quizId: quizId,
      sectionId,
      question: "The question to be answered",
      info: "Info paragraph",
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
    };
    const res = await request(app).post(`/api/question`).send(wrongQuestionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("type");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The type field should not be empty"
    );
  });
  it("Request a Question Creation :: Missing order", async () => {
    const wrongQuestionReq: Omit<IQuestion, "order"> = {
      quizId: quizId,
      sectionId,
      question: "The question to be answered",
      info: "Info paragraph",
      type: QuestionType.COMPOSED,
      options: [
        {
          option: "Wording of the option",
          info: "Info about the option to clarify",
          metadata: {
            type: "test",
          },
        },
      ],
    };
    const res = await request(app).post(`/api/question`).send(wrongQuestionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("order");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The order field should not be empty"
    );
  });
  it("Request a Question Creation :: Missing options", async () => {
    const wrongQuestionReq: Omit<IQuestion, "options"> = {
      quizId: quizId,
      sectionId,
      question: "The question to be answered",
      info: "Info paragraph",
      type: QuestionType.COMPOSED,
      order: 1,
    };
    const res = await request(app).post(`/api/question`).send(wrongQuestionReq);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(1);
    expect(res.body.payload[0]).toHaveProperty("field");
    expect(res.body.payload[0].field).toBe("options");
    expect(res.body.payload[0]).toHaveProperty("error_msg");
    expect(res.body.payload[0].error_msg).toBe(
      "The options field should not be empty and must have at least 1 options"
    );
  });

  it("should return a 404 error for a non-existent section", async () => {
    const res = await request(app).post(`/api/question`).send(questionReq);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toEqual("Not Found");
    expect(res.body.payload).toEqual("Quiz or Section not found or invalid ID");
  });

  it("should return a 404 error for a non-existent quiz", async () => {
    const res = await request(app).post(`/api/question`).send(questionReq);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toEqual("Not Found");
    expect(res.body.payload).toEqual("Quiz or Section not found or invalid ID");
  });

  it("should return a 401 error for missing user", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app).post(`/api/question`).send(questionReq);

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized error");
    expect(res.body.payload).toEqual(
      "This user is not authorized to access this endpoint"
    );
  });
});
