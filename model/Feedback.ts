import mongoose, { Document, Schema, Types } from "mongoose";

export interface Feedback extends Document {
  title: string;
  description: string;
  category: "bug" | "feature" | "improvement" | "other";
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
  },
  { timestamps: true },
);

export default (mongoose.models.Feedback as mongoose.Model<Feedback>) ||
  mongoose.model<Feedback>("Feedback", FeedbackSchema);
