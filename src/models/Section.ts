import mongoose, { Schema, Types } from "mongoose";

export interface ISection {
  quizId: Types.ObjectId;
  name: string;
  questions?: Types.ObjectId[];
}

export const sectionSchema = new Schema<ISection>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    name: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  {
    timestamps: true,
  }
);

export const Section = mongoose.model("Section", sectionSchema);
