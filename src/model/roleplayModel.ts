import mongoose, { Document, model, Schema } from "mongoose";

interface Roleplay {
  name: string;
  description: string;
  imageUrl: string;
  perspective?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface roleplayDocument extends Roleplay, Document {}

const roleplaySchema = new Schema<roleplayDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    perspective: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
roleplaySchema.index({ name: 1 }, { unique: true });

const roleplayModel = model<roleplayDocument>("roleplay", roleplaySchema);

export { Roleplay, roleplayDocument, roleplayModel };
