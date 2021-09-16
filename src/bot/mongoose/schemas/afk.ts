import mongoose from "mongoose";
import { IAfk } from "../interfaces/schemaInterface";

const afkSchema = new mongoose.Schema({
  // Make schema
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  afk: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  username: {
    // So we can change username back
    type: String,
    required: true,
  },
});

const afk = mongoose.model<IAfk>("afk", afkSchema);

export { afk };
