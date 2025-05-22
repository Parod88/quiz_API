import mongoose, { Schema } from "mongoose";
import { IAnswer, answerSchema } from "./Answer";

enum RecordStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface IRecord {
  progress: IAnswer[];
  status: RecordStatus;
}

const recordSchema = new Schema<IRecord>(
  {
    progress: [answerSchema],
    status: {
      type: String,
      enum: [RecordStatus.PENDING, RecordStatus.COMPLETED],
      default: RecordStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const Record = mongoose.model("Record", recordSchema);
