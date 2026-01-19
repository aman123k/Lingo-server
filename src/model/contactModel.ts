import mongoose, { Document, model, Schema } from "mongoose";

interface Contact {
  userEmail: string;
  subject: string;
  problem: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

interface contactDocument extends Contact, Document {}

const contactSchema = new Schema<contactDocument>({
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  problem: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "closed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
contactSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const contactModel = model<contactDocument>("contact", contactSchema);

export { Contact, contactDocument, contactModel };
