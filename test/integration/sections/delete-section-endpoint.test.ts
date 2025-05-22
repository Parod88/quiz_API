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

describe("Delete Section Endpoint Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    serverConnection.close();
  });

  let quizId: any;
  let nonExistingId: any = "D9BFDDBD6D6273F1E6FA3D1B";
  const wrongFormatId = "wrongFormatId";
  let sectionId: any;
  let sectionName: string;

  beforeEach(async () => {
    const quiz = await Quiz.create({
      owner: user.id,
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
    sectionName = section.name;
  });

  afterEach(async () => {
    await Quiz.deleteMany({});
    await Section.deleteMany({});
  });

  it("should successfully delete a section", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );
    const res = await request(app)
      .delete(`/api/section/${sectionId}`)
      .send({ quizId });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      `The section "${sectionName}" has been succesfully deleted`
    );
  });

  it("should return a 400 error for quiz validation failure", async () => {
    const res = await request(app)
      .delete(`/api/section/${sectionId}`)
      .send({ wrongFormatId });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Validation Error");
    expect(res.body.payload[0].error_msg).toBe(
      "Quiz ID is mandatory and must be in a valid format"
    );
  });
  it("should return a 400 error for section validation failure", async () => {
    const res = await request(app)
      .delete(`/api/section/${wrongFormatId}`)
      .send({ quizId });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Validation Error");
    expect(res.body.payload[0].error_msg).toBe(
      "Section ID is mandatory and must be in a valid format"
    );
  });

  it("should return a 404 error for a non-existent quiz", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = user;
        next();
      }
    );

    const res = await request(app)
      .delete(`/api/section/${sectionId}`)
      .send({ quizId: nonExistingId });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Not Found");
    expect(res.body.payload).toBe(
      "Sorry, there is no Quiz matching this quizId"
    );
  });

  it("should return a 404 error for a non-existent section", async () => {
    const res = await request(app)
      .delete(`/api/section/${nonExistingId}`)
      .send({ quizId });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Not Found");
    expect(res.body.payload).toBe(
      "Sorry, there is no Section matching this sectionId"
    );
  });

  it("should return a 401 error for unauthorized access", async () => {
    (authMock as jest.MockedFunction<typeof authMock>).mockImplementation(
      (req: any, _: any, next: NextFunction) => {
        req.user = null;
        next();
      }
    );
    const res = await request(app)
      .delete(`/api/section/${sectionId}`)
      .send({ quizId });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.message).toBe("Unauthorized error");
    expect(res.body.payload).toBe(
      "This user is not authorized to access this endpoint"
    );
  });
});
