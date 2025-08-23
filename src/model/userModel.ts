import mongoose, { Document, model, Schema } from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  loginWith: string;
  languageLevel: string;
  learningGoal: string;
  learningReason: string;
  learningStyle: string;
  ageGroup: string;
  isSurveyComplete: boolean;
  translationLanguage: string;
  practiceFrequency: string;
  createdAt: Date;
}

interface userDocument extends User, Document {}

const userSchema = new Schema<userDocument>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, trim: true },
  loginWith: { type: String, trim: true },
  languageLevel: { type: String, trim: true },
  learningGoal: { type: String, trim: true },
  learningReason: { type: String, trim: true },
  learningStyle: { type: String, trim: true },
  ageGroup: { type: String, trim: true },
  translationLanguage: { type: String, trim: true },
  practiceFrequency: { type: String, trim: true },
  isSurveyComplete: { type: Boolean, required: true, trim: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel = model<userDocument>("user", userSchema);

export { User, userDocument, userModel };
