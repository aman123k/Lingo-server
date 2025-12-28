import mongoose, { Document, model, Schema } from "mongoose";

interface Debate {
  name: string;
  perspective: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface debateDocument extends Debate, Document {}

const debateSchema = new Schema<debateDocument>(
  {
    name: { type: String, required: true, trim: true },
    perspective: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
debateSchema.index({ name: 1 }, { unique: true });

const debateModel = model<debateDocument>("debate", debateSchema);

export { Debate, debateDocument, debateModel };
