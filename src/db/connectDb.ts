import mongoose from "mongoose";
import { characterModel } from "../model/characterModel";
import { debateModel } from "../model/debateModel";
import { roleplayModel } from "../model/roleplayModel";
import { travelModel } from "../model/travelModel";

import characterData from "../data/charector.json";
import debatesData from "../data/debates.json";
import roleplaysData from "../data/roleplays.json";
import travelsData from "../data/travels.json";

const seedData = async () => {
  try {
    const charCount = await characterModel.countDocuments();
    if (charCount === 0) {
      await characterModel.insertMany(characterData);
      console.log("Database seeded with characters!");
    }

    const debateCount = await debateModel.countDocuments();
    if (debateCount === 0) {
      await debateModel.insertMany(debatesData);
      console.log("Database seeded with debates!");
    }

    const roleplayCount = await roleplayModel.countDocuments();
    if (roleplayCount === 0) {
      await roleplayModel.insertMany(roleplaysData);
      console.log("Database seeded with roleplays!");
    }

    const travelCount = await travelModel.countDocuments();
    if (travelCount === 0) {
      await travelModel.insertMany(travelsData);
      console.log("Database seeded with travel scenarios!");
    }
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
};

const connectDb = async (DATABASE_URL: string) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("connection successfully");
    await seedData();
  } catch (err) {
    console.log("can't connect db", err);
  }
};
export default connectDb;
