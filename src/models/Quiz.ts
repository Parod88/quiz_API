import mongoose, { Schema, Types } from "mongoose";

export interface IQuiz {
  owner: string;
  title: string;
  description: string;
  instructions: string;
  sections?: Types.ObjectId[];
}

export const quizSchema = new Schema<IQuiz>(
  {
    owner: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    instructions: { type: String },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
