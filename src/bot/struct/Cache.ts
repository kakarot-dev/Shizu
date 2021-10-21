/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  MessageEmbed,
  Guild,
  GuildMember,
  Snowflake,
  Collection,
  Role,
} from "discord.js";
import Bot from "../api/Client";
import { Status_cache } from "./Discord-Status";

export type guild = {
  id: bigint;
  statusChannelId?:  string | null;
  modLogsChannelId?: string | null;
  muteRoleId?: string | null;
  prefix?: string | null;
  suggestChannelId?: string | null;
  ioc?: boolean | null;
  waifu: string | null;
  modRoles?: string[] | null;
  autoMod?: any;
}

export class Cache {
  data = new Collection<string, guild>();
  statuscache = Status_cache;
  client: Bot;
  constructor(client: Bot) {
    this.client = client
    this.loadData();
  }
  async loadData() {
    const data = await this.client.prisma.server.findMany({})
    if (!data || !data.length) {
      console.log(`[PRISMA] No data in db found! Hence running the Client#registerGuilds seems like a option right now`)
      return
    }
   for (const guild of data) {
     if (!guild.prefix) guild.prefix = process.env.PREFIX as string
     this.data.set(`${guild.id}`, guild)
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
    return data.modLogsChannelId;
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

  async MuteCheck() {
    const now = new Date();
    const results = await this.client.prisma.mutes.findMany({}).catch(() => null)
    if (results && results.length) {
      const filtered = results.filter(data => {
        const date = new Date(data.expires as Date)
        return date < now
      })
      if (filtered.length) {
        for (const result of filtered) {
          const {guildId, id, reason} = result;

          const guild: Guild | undefined = await this.client.guilds.fetch(
              `${BigInt(guildId as string)}`
          );
          const member: GuildMember | undefined = await guild?.members.fetch(
              `${id}`
          );
          if (!member) {
            await this.client.prisma.mutes.deleteMany({
              where: {
                id: BigInt(id),
                guildId: guildId
              }
            });
            return;
          }
          const mrole = await this.muterole(guild!);
          if (!mrole) return;
          await member.roles.remove(mrole)
          const dm = new MessageEmbed()
              .setTitle(`You are unmuted in ${guild?.name}`)
              .setColor("GREEN")
              .setDescription(`**Reason**\n${reason}`)
              .setThumbnail(
                  `https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`
              )
          await member.send({embeds: [dm]}).catch(() => null);
          this.client.emit("unmuted", member, reason);
          await this.client.prisma.mutes.deleteMany({
            where: { ...result }
          });
        }
      }
    }
  }

  async muterole(guild: Guild): Promise<Role | undefined> {
    let mutedrole: Role | undefined;
    // const custommuterole = await schema.findOne({
    //   guildId: guild.id,
    //   muteRoleId: { $exists: true },
    // });
    const custommuterole = await this.client.cache.data.get(guild.id)
    const uhhh = guild.roles.cache.find((r) => {
      return r.name === "Muted";
    });
    if (custommuterole) {
      const mt = guild.roles.cache.find((r) => {
        return r.id === custommuterole?.muteRoleId;
      });
      if (!mt) {
        return
      }
      mutedrole = mt;
    } else if (!custommuterole) mutedrole = uhhh;
    return mutedrole;
  }
  check(): void {
    this.MuteCheck();
  }
}
