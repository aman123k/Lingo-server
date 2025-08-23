import mongoose, { Document, Schema } from "mongoose";

interface conversationDocument extends Document {}

const conversationModel = new Schema<conversationDocument>({});
