import request from "supertest";

import { app, serverConnection } from "../../../src/index";
import { ObjectId } from "mongodb";
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

describe("Delete Question", () => {
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
  let questionId: any;
  let nonExistentId: any = ObjectId.createFromHexString(
    "668F6A918A3FC35DB4DFB1F2"
  );
  const wrongId = "wrongId" as any;

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
    questionId = question._id;
    await Quiz.findByIdAndUpdate(quizId, { $push: { sections: sectionId } });
    await Section.findByIdAndUpdate(sectionId, {
      $push: { questions: questionId },
    });
  });

  afterEach(async () => {
    await Quiz.deleteMany({});
    await Section.deleteMany({});
    await Question.deleteMany({});
  });

  it("Request a Question delete :: Happy Path", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );

    const res = await request(app).delete(`/api/question/${questionId}`).send({
      quizId: quizId.toString(),
      sectionId: sectionId.toString(),
    });

    expect(res.status).toBe(200);
    const responseBody = JSON.parse(res.text);

    expect(responseBody).toBe(
      `The question ${questionId} has been succesfully deleted`
    );
  });

  it("Request a Question delete :: Wrong format or missing quizId", async () => {
    const res = await request(app)
      .delete(`/api/question/${questionId}`)
      .send({ quizId: wrongId, sectionId: sectionId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Validation Error");
    expect(res.body.payload[0].error_msg).toBe(
      "Quiz ID is mandatory and must be in a valid format"
    );
  });

  it("Request a Question delete :: Wrong format or missing sectionId", async () => {
    const res = await request(app)
      .delete(`/api/question/${questionId}`)
      .send({ quizId: quizId, sectionId: wrongId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Validation Error");
    expect(res.body.payload[0].error_msg).toBe(
      "Section ID is mandatory and must be in a valid format"
    );
  });

  it("Request a Question delete :: Wrong format or missing questionId", async () => {
    const res = await request(app)
      .delete(`/api/question/${wrongId}`)
      .send({ quizId: quizId, sectionId: sectionId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Validation Error");
    expect(res.body.payload[0].error_msg).toBe(
      "Question ID is mandatory and must be in a valid format"
    );
  });
  it("Request a Question delete :: Wrong user", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app)
      .delete(`/api/question/${questionId}`)
      .send({ quizId: quizId, sectionId: sectionId });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Unauthorized error");
    expect(res.body.payload).toBe(
      "This user is not authorized to access this endpoint"
    );
  });

  it("Request a Question delete :: Not found quiz ID", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app)
      .delete(`/api/question/${questionId}`)
      .send({ quizId: nonExistentId, sectionId: sectionId });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Not Found");
    expect(res.body.payload).toBe("Quiz not found");
  });

  it("Request a Question delete :: Not found sectionId", async () => {
    const res = await request(app)
      .delete(`/api/question/${questionId}`)
      .send({ sectionId: nonExistentId, quizId: quizId });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Not Found");
    expect(res.body.payload).toBe("Quiz not found");
  });

  it("Request a Question delete :: Not found Question", async () => {
    const res = await request(app)
      .delete(`/api/question/${nonExistentId}`)
      .send({ sectionId: sectionId, quizId: quizId });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Not Found");
    expect(res.body.payload).toBe("Question not found");
  });

  it("should handle errors gracefully", async () => {
    jest.spyOn(Question, "findOneAndDelete").mockImplementation(() => {
      throw new Error("Database query failed");
    });

    const res = await request(app).delete(`/api/question/${questionId}`).send({
      quizId: quizId,
      sectionId: sectionId,
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Internal Error");
    expect(res.body.payload).toBe("Database query failed");

    (Question.findOneAndDelete as jest.Mock).mockRestore();
  });
});
