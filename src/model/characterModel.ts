import mongoose, { Document, model, Schema } from "mongoose";

interface Character {
  name: string;
  role: string;
  personalityTraits: string[];
  backstory: string;
  interests: string[];
  imageUrl: string;
  speakingStyle?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface characterDocument extends Character, Document {}

const characterSchema = new Schema<characterDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    personalityTraits: { type: [String], required: true, default: [] },
    backstory: { type: String, required: true, trim: true },
    interests: { type: [String], required: true, default: [] },
    imageUrl: { type: String, required: true, trim: true },
    speakingStyle: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
characterSchema.index({ name: 1 }, { unique: true });

const characterModel = model<characterDocument>("character", characterSchema);

export { Character, characterDocument, characterModel };
