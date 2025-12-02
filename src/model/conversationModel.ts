import mongoose, { Document, model, Schema } from "mongoose";

// Define conversation fields here as needed
interface Conversation {
  role: string;
  conversationMode: string;
  content: string;
  translatedContent?: string;
  correctionContent?: string;
  timestamp: Date;
  userId: mongoose.Types.ObjectId;
}

interface conversationDocument extends Conversation, Document {}

const conversationSchema = new Schema<conversationDocument>({
  role: { type: String, required: true, trim: true },
  conversationMode: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  translatedContent: { type: String, trim: true },
  correctionContent: { type: String, trim: true },
  timestamp: { type: Date },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
});

const conversationModel = model<conversationDocument>(
  "conversation",
  conversationSchema
);

export { Conversation, conversationDocument, conversationModel };
