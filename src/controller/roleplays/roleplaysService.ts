import { roleplayModel } from "../../model/roleplayModel";
import roleplays from "../../data/roleplays.json";

export const insertManyRoleplays = async () => {
  try {
    return await roleplayModel.insertMany(roleplays, { ordered: false });
  } catch (err) {
    // ordered: false allows continue on duplicate or validation error; you may want to handle errors here
    throw err;
  }
};
