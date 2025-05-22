import mongoose, { Schema, Types } from "mongoose";
import { IOption } from "./Question";

export interface IAnswer {
  question: Types.ObjectId;
  value: IOption[];
}

export const optionSchema = new Schema<IOption>({
  option: { type: String, required: true },
  info: { type: String },
  metadata: { type: Schema.Types.Mixed },
});

export const answerSchema = new Schema<IAnswer>(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    value: [optionSchema],
  },
  {
    timestamps: true,
  }
);

export const Answer = mongoose.model("Answer", answerSchema);
