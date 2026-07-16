import mongoose, { Document, model, Schema } from "mongoose";

interface Travel {
  name: string;
  description: string;
  imageUrl: string;
  perspective?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface travelDocument extends Travel, Document {}

const travelSchema = new Schema<travelDocument>(
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
travelSchema.index({ name: 1 }, { unique: true });

const travelModel = model<travelDocument>("travel", travelSchema);

export { Travel, travelDocument, travelModel };
