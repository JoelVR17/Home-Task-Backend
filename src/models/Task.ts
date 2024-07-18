import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
  PENDING: "pending",
  ON_OLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  taskName: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  notes: Types.ObjectId[];
}

const TaskSchema: Schema = new Schema(
  {
    taskName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: Types.ObjectId,
      ref: "Project",
    },

    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },

    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],

    notes: [
      {
        type: Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

/**
 * Middleware
 */

// Delete all references
TaskSchema.pre("deleteOne", { document: true }, async function () {
  const taskId = this._id;
  if (!taskId) return;
  await Note.deleteMany({ task: taskId });
});

const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
