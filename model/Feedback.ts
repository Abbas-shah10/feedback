import mongoose, { Document, Schema, Types } from "mongoose";

export interface FeedbackComment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  body: string;
  createdAt: Date;
}

export interface Feedback extends Document {
  title: string;
  description: string;
  category: "bug" | "feature" | "improvement" | "other";
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  userId: Types.ObjectId;
  comments: FeedbackComment[];
  upvotes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackCommentSchema = new Schema<FeedbackComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

const FeedbackSchema = new Schema<Feedback>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: {
      type: String,
      enum: ["bug", "feature", "improvement", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: { type: [FeedbackCommentSchema], default: [] },
    upvotes: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
  },
  { timestamps: true },
);

export default (mongoose.models.Feedback as mongoose.Model<Feedback>) ||
  mongoose.model<Feedback>("Feedback", FeedbackSchema);
