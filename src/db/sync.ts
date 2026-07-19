import mongoose from "mongoose";
import { config } from "dotenv";
import { travelModel } from "../model/travelModel";
import { userModel } from "../model/userModel";
import travelsData from "../data/travels.json";

config();

const dbUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/englishTutor";

const syncDatabase = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to database successfully");

    // Migrate existing users to have "free" plan if not set
    const userMigration = await userModel.updateMany(
      { subscriptionPlan: { $exists: false } },
      { $set: { subscriptionPlan: "free" } }
    );
    console.log(`Migrated ${userMigration.modifiedCount} users to "free" plan.`);

    // Sync travel documents
    for (const item of travelsData) {
      const updated = await travelModel.findOneAndUpdate(
        { name: item.name },
        { 
          description: item.description,
          imageUrl: item.imageUrl,
          perspective: item.perspective
        },
        { upsert: true, new: true }
      );
      console.log(`Synced travel: ${updated.name} -> ${updated.imageUrl}`);
    }

    console.log("Database synchronization completed!");
  } catch (error) {
    console.error("Error syncing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
};

syncDatabase();
