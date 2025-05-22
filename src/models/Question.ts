import mongoose, { Schema, Types } from "mongoose";

export enum QuestionType {
  SINGLE_CHOICE = "single",
  MULTIPLE_CHOICE = "multiple",
  TEXT = "text",
  DATE = "date",
  BOOLEAN = "boolean",
  COMPOSED = "composed",
}

export interface IOption {
  option: string;
  info: string;
  metadata?: any;
}

export interface IQuestion {
  quizId: Types.ObjectId;
  sectionId: Types.ObjectId;
  question: string;
  info?: string;
  order?: number;
  type: QuestionType;
  options: IOption[];
}

export const questionSchema = new Schema<IQuestion>(
  {
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    question: { type: String, required: true },
    info: { type: String },
    order: { type: Number },
    type: {
      type: String,
      enum: [
        QuestionType.SINGLE_CHOICE,
        QuestionType.MULTIPLE_CHOICE,
        QuestionType.TEXT,
        QuestionType.DATE,
        QuestionType.BOOLEAN,
        QuestionType.COMPOSED,
      ],
      required: true,
    },
    options: [
      {
        option: { type: String, required: true },
        info: { type: String },
        metadata: { type: Schema.Types.Mixed },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model("Question", questionSchema);
