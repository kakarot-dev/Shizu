import mongoose from "mongoose";

const schema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  statusChannelId: {
    type: String,
  },
  modLogsChannelId: {
    type: String,
  },
  muteRoleId: {
    type: String,
  },
  prefix: {
    type: String,
  },
  suggestChannelId: {
    type: String,
  },
  ioc: {
    enabled: Boolean,
    color: String,
  },
  waifu: String,
  modRoles: { type: Array, default: [] },
  autoMod: {
    enabled: Boolean,
    ignoredRoles: { type: Array, default: [] },
    newLineThreshold: Number,
    massMentionThreshold: Number,
    linkAutoMod: {
      enabled: Boolean,
      whiteListedLinks: { type: Array, default: [] }
    }, 
    punishments: {
      antiNewLine: String,
      massMention: String,
      antiLink: String,
    }
  },
});

const guild = mongoose.model("guild", schema);

export { guild };
