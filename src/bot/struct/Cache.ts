/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { guild as schema } from "../mongoose/schemas/guild";
import { mute_Schema as muted } from "../mongoose/schemas/mute";
import {
  MessageEmbed,
  Guild,
  GuildMember,
  TextChannel,
  Snowflake,
  Collection,
  Role,
} from "discord.js";
import { Schedule_Schema as scheduledSchema } from "../mongoose/schemas/schedule";
import Bot from "../api/Client";
import { Status_cache } from "./Discord-Status";

export type obj = {
  prefix: string | null;
  modlogChannelId?: string | null;
  suggestChannelId?: string | null;
  ioc?: {
    enabled: boolean;
    color: string;
  };
  waifu?: string | null;
  modRoles?: string[] | null;
  autoMod?: {
    enabled?: boolean,
    ignoredRoles?: string[];
    newLineThreshold?: number;
    massMentionThreshold?: number;
    linkAutoMod: {
      enabled: boolean;
      whiteListedLinks: [];
    };
    punishments?: {
      antiNewLine?: string;
      massMention?: string;
      antiLink?: string;
    }
  }
};

export class Cache {
  data = new Collection<string, obj>();
  statuscache = Status_cache;
  client: Bot;
  constructor() {
    this.loadData();
  }
  async loadData() {
    const data = await schema.find({});
    if (!data) console.log("No data Found");
    for (const res of data) {
      this.data.set(res.guildId, {
        prefix: res.prefix ? res.prefix : process.env.PREFIX,
        modlogChannelId: res.modLogsChannelId ? res.modLogsChannelId : null,
        suggestChannelId: res.suggestChannelId ? res.suggestChannelId : null,
        ioc: res.ioc
          ? {
              enabled: res.ioc.enabled ?? false,
              color: res.ioc.color ?? "no",
            }
          : {
              enabled: false,
              color: "no",
            },
        waifu: res.waifu,
        modRoles: res.modRoles ?? [],
        autoMod: res.autoMod ? {
            enabled: res.autoMod?.enabled ?? false,
            ignoredRoles: res.autoMod?.ignoredRoles ?? [],
            newLineThreshold: res.autoMod?.newLineThreshold ?? 0,
            massMentionThreshold: res.autoMod?.massMentionThreshold ?? 0,
            linkAutoMod: {
              enabled: res.autoMod?.linkAutoMod.enabled ?? false,
              whiteListedLinks: res.autoMod?.linkAutoMod.whiteListedLinks ?? []
            },
            punishments: {
              antiNewLine: res.autoMod?.punishments.antiNewLine ?? "Unknown",
              massMention: res.autoMod?.punishments.massMention ?? "Unknown",
              antiLink: res.autoMod?.punishments.antiLink ?? "Unknown"
            } 
          } :
          {
            enabled: false,
            ignoredRoles: [],
            newLineThreshold: 0,
            massMentionThreshold: 0,
            linkAutoMod: {
              enabled: false,
              whiteListedLinks: []
            },
          }
      });
    }
  }

  getData(guildId: Snowflake | undefined) {
    if (!guildId) return;
    return this.data.get(guildId);
  }

  getSuggestChannel(guildId: Snowflake) {
    const data = this.data.get(guildId);
    if (!data) return null;
    return data.suggestChannelId;
  }

  getModChannel(guildId: Snowflake) {
    const data = this.data.get(guildId);
    if (!data) return null;
    return data.modlogChannelId;
  }

  getPrefix(guildId: Snowflake | undefined) {
    if (!guildId) return;
    const data = this.data.get(guildId);
    if (!data) return null;
    return data.prefix;
  }

  getAutoMod(guildId: Snowflake | undefined) {
    if (!guildId) return;
    const data = this.data.get(guildId);
    if (!data) return null;
    return data.autoMod;
  }

  getIOC(guildId: Snowflake | undefined) {
    if (!guildId) return;
    const data = this.data.get(guildId);
    if (!data) return null;
    return data.ioc;
  }

  async MuteCheck(client: Bot) {
    const now = new Date();

    const condtion = {
      expires: {
        $lt: now,
      },
    };
    const results = await muted.find(condtion);
    if (results && results.length) {
      for (const result of results) {
        const { guildId, userId, reason, staffTag, staffId } = result;

        const guild: Guild | undefined = client.guilds.cache.get(
          `${BigInt(guildId)}`
        );
        const member: GuildMember | undefined = guild?.members.cache.get(
          `${BigInt(userId)}`
        );
        if (!member) {
          await muted.deleteMany(condtion);
          return;
        }
        const mrole = await this.muterole(guild!);
        if (!mrole) return;
        await member.roles.remove(mrole).catch(() => {
          return;
        });
        const dm = new MessageEmbed()
          .setTitle(`You are unmuted in ${guild?.name}`)
          .setColor("GREEN")
          .setDescription(`**Reason**\n${reason}`)
          .setThumbnail(
            `https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`
          )
          .addField(`**Staff**`, `${staffTag}(${staffId})`, true);
        await member.send({ embeds: [dm] }).catch(() => null);
        client.emit("unmuted", member, staffTag, reason);
      }
      await muted.deleteMany(condtion);
    }
  }

  async muterole(guild: Guild): Promise<Role | undefined> {
    let mutedrole: Role | undefined;
    const custommuterole = await schema.findOne({
      guildId: guild.id,
      muteRoleId: { $exists: true },
    });
    const uhhh = guild.roles.cache.find((r) => {
      return r.name === "Muted";
    });
    if (custommuterole) {
      const mt = guild.roles.cache.find((r) => {
        return r.id === custommuterole?.muteRoleId;
      });
      if (!mt) {
        await schema.findOneAndUpdate(
          {
            guildId: guild.id,
            muteRoleId: { $exists: true },
          },
          {
            $unset: {
              muteRoleId: "",
            },
          }
        );
      }
      mutedrole = mt;
    } else if (!custommuterole) mutedrole = uhhh;
    return mutedrole;
  }
  async checkPosts(client: Bot): Promise<void> {
    const query = {
      date: {
        $lte: Date.now(),
      },
    };

    const results = await scheduledSchema.find(query);

    for (const post of results) {
      const { date, content, guildId, channelId } = post;

      const guild: Guild | undefined = client.guilds.cache.get(
        `${BigInt(guildId)}`
      );
      if (!guild) {
        continue;
      }

      const channel = guild.channels.cache.get(
        `${BigInt(channelId)}`
      ) as TextChannel;
      if (!channel) {
        continue;
      }
      const content_embed = new MessageEmbed()
        .setDescription(content)
        .setTimestamp(date);

      channel.send({
        embeds: [content_embed],
      });
    }
    await scheduledSchema.deleteMany(query);
  }
  check(client: Bot): void {
    this.checkPosts(client);
    this.MuteCheck(client);
  }
}
