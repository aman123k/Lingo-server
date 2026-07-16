import mongoose, { Document, model, Schema } from "mongoose";

// Define conversation modes
export type ConversationMode = "chat" | "character" | "roleplay" | "debate" | "business" | "vocab" | "story" | "travel";

// Define conversation fields here as needed
interface Conversation {
  role: string;
  conversationMode: ConversationMode;
  content: string;
  translatedContent?: string;
  correctionContent?: string;
  timestamp: Date;
  userId: mongoose.Types.ObjectId;
  characterName?: string;
  characterId: mongoose.Types.ObjectId;
  // Roleplay mode fields
  roleplayId: mongoose.Types.ObjectId;
  scenario?: string;
  // Debate mode fields
  topic?: string;
  debateId: mongoose.Types.ObjectId;
  feedback?: string;
  correction?: string;
  chatSessionId?: string;
  travelId: mongoose.Types.ObjectId;
}

interface conversationDocument extends Conversation, Document {}

const conversationSchema = new Schema<conversationDocument>({
  role: { type: String, required: true, trim: true },
  conversationMode: {
    type: String,
    required: true,
    trim: true,
    enum: ["chat", "character", "roleplay", "debate", "business", "vocab", "story", "travel"],
    default: "chat",
  },
  content: { type: String, required: true, trim: true },
  translatedContent: { type: String, trim: true },
  correctionContent: { type: String, trim: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  characterName: { type: String, trim: true },
  characterId: { type: Schema.Types.ObjectId, ref: "character" },
  topic: { type: String, trim: true },
  debateId: { type: Schema.Types.ObjectId, ref: "debate" },
  roleplayId: { type: Schema.Types.ObjectId, ref: "roleplay" },
  travelId: { type: Schema.Types.ObjectId, ref: "travel" },
  scenario: { type: String, trim: true },
  feedback: { type: String, trim: true },
  correction: { type: String, trim: true },
  chatSessionId: { type: String, trim: true, index: true },
});

const conversationModel = model<conversationDocument>(
  "conversation",
  conversationSchema
);

export { Conversation, conversationDocument, conversationModel };
