/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { guild as GuildModel } from "../mongoose/schemas/guild";
import Bot from "../api/Client";
import {
  StatuspageUpdates,
  Incident,
  ComponentStatus,
  IncidentStatus,
  Indicator,
  IncidentUpdates,
} from "statuspage.js";
import settings from "../settings";
import {
  Guild,
  Webhook,
  TextChannel,
  User,
  MessageEmbed,
  Collection,
} from "discord.js";
import { utc } from "moment";

interface Status_CacheType {
  guildId: string;
  msg_id: string;
  incident: string;
  incident_updates: string[];
}

export const Status_cache = new Collection<string, Status_CacheType>();

export default async function (client: Bot) {
  const s = new StatuspageUpdates(
    //"3fqdslht4ksc",
    settings.DISCORDSTATUSAPI ? settings.DISCORDSTATUSAPI : "3fqdslht4ksc",
    10_000
  );
  s.on("incident_update", async (i) => {
    const update = i.incident_updates[0];
    const results = await GuildModel.find();

    for (const result of results) {
      if (!result.statusChannelId) continue;
      const guild = client.guilds.cache.get(`${BigInt(result.guildId)}`);
      if (!guild) {
        GuildModel.findOneAndUpdate(
          {
            guildId: result.guildId,
          },
          {
            $unset: {
              statusChannelId: "",
            },
          }
        );
        continue;
      }
      const channel = guild.channels.cache.get(
        `${BigInt(result.statusChannelId)}`
      ) as TextChannel;
      if (!channel) {
        await GuildModel.findOneAndUpdate(
          {
            guildId: result.guildId,
          },
          {
            $unset: {
              statusChannelId: "",
            },
          }
        );
      }
      const hook = await webhook(channel, guild, client);
      if (!hook) continue;
      const embed = await Embed(i);
      let ss;
      if (
        (ss = Status_cache.find(
          (a) => a.incident === i.id && a.guildId === guild.id
        ))
      ) {
        if (ss?.incident_updates.includes(update.id)) {
          return;
        }
      }
      let message;
      if (!ss) {
        message = await hook.send({
          username: "Shizu Discord Status",
          avatarURL:
            "https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png",
          embeds: [embed],
        });
      } else {
        let check = false;
        const messag = await channel.messages
          .fetch(`${BigInt(ss.msg_id)}`)
          .catch(() => {
            check = true;
          });
        if (check) continue;
        if (!messag) continue;
        if (messag.author.id !== hook.id) continue;
        message = await hook.editMessage(messag, {
          content: `A new Discord Status Update`,
          embeds: [embed],
        });
      }
      if (ss) {
        // ss.incident_updates.push(update.id);
        Status_cache.set(guild.id, {
          guildId: guild.id,
          msg_id: message.id,
          incident: i.id,
          incident_updates: [...ss.incident_updates, update.id],
        });
        // console.log(Status_cache)
      } else {
        Status_cache.set(guild.id, {
          guildId: guild.id,
          msg_id: message.id,
          incident: i.id,
          incident_updates: [update.id],
        });
      }
      // hook.send(embed)
      console.log(
        `Guild Id: ${guild.id} & channel Id: ${channel.id} & message Id: ${message.id} & incident Id: ${i.id} & Update Id: ${update.id} has been sent an update of the discord Status`
      );
    }
  });
  s.on("start", async (...args) => {
    const st = await s.statuspage.status();

    console.log(
      `Checking ${st.page.name} (${st.page.id}) for updates every ${
        s.interval / 1000
      }s`
    );

    console.debug(...args);
  });

  // s.on('run', async (...args) => console.debug(...args));
  // s.on('stop', (...args) => console.debug(...args));
  // s.on('incident_update', (...args) => logger.debug(...args));

  s.start().catch(console.error);
}

async function webhook(
  channel: TextChannel,
  guild: Guild,
  client: Bot
): Promise<Webhook | void> {
  const arr: Webhook[] = [];
  let check = false;
  if (!channel.permissionsFor(guild?.me!).has("MANAGE_WEBHOOKS")) {
    await GuildModel.findOneAndUpdate(
      {
        guildId: guild.id,
      },
      {
        $unset: {
          statusChannelId: "",
        },
      }
    );
    const owner = await guild.fetchOwner();
    await owner
      .send(
        `I wasnt able to get a webhook from the channel with the id ${channel.id} for the mod Logs\nI have **reset** the Mod Logs\nI dont have Perms for manage webhooks, pls make sure I have that permission`
      )
      .catch(() => {
        return;
      });
    return;
  }
  const webhook = await channel.fetchWebhooks();
  webhook.forEach(async (webhook: Webhook) => {
    if (webhook.owner instanceof User && webhook.owner.id === client.user.id)
      arr.push(webhook);
    else return;
  });
  if (!arr[0]) {
    if (webhook.size !== 10) {
      const web = await channel
        .createWebhook("Shizu Logger", {
          avatar: `${client.user.displayAvatarURL()}`,
          reason: `Mod Logs`,
        })
        .catch(async () => {
          check = true;
          await GuildModel.findOneAndUpdate(
            {
              guildId: guild.id,
            },
            {
              $unset: {
                statusChannelId: "",
              },
            }
          );
          const owner = await guild.fetchOwner();
          await owner
            .send(
              `I wasnt able to get a webhook from the channel with the id ${channel.id} for the mod logs\nI have **reset** the Mod Logs`
            )
            .catch(() => {
              return;
            });
          return;
        });
      if (check) return;
      if (web instanceof Webhook) arr[0] = web;
    } else {
      const logger = webhook.first();
      if (logger instanceof Webhook) arr[0] = logger;
    }
  }
  return arr[0];
}

async function Embed(i: Incident): Promise<MessageEmbed> {
  const formatFields = (update: IncidentUpdates) => {
    return {
      name: `${getStatusEmoji(update.status)} ${capitalize(
        update.status
      )} (${utc(update.updated_at).format("Do MMMM HH:mm:ss")})`,
      value:
        update.body.length > 1024
          ? trim(update.body)
          : update.body ?? "No Info Available",
    };
  };
  const fields = [...i.incident_updates] // copy cus arrays are mutable
    .reverse()
    .map(formatFields)
    .slice(-25);
  const embed = new MessageEmbed()
    .setAuthor(
      `Discord Status`,
      `https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png`,
      `https://discord.gg/b7HzMtSYtX`
    )
    .setURL(`${i.shortlink}`)
    .setTimestamp(new Date(i.created_at))
    .setColor(getColor(i.incident_updates[0].status))
    .addFields(fields);
  if (i.name.length <= 256) {
    embed.setTitle(i.name);
  } else {
    embed.setTitle("Discord Status Update");
    embed.setDescription(`**${i.name}**`);
  }
  return embed;
}

function getColor(
  status: Indicator | IncidentStatus | ComponentStatus
): number {
  switch (status) {
    case "none":
    case "resolved":
    case "operational":
      return 4437377; // green

    case "minor":
    case "monitoring":
    case "degraded_performance":
      return 15920962; // yellow

    case "major":
    case "partial_outage":
    case "investigating":
      return 15571250; // orange

    case "identified":
    case "major_outage":
    case "critical":
      return 15816754; // red

    case "postmortem":
    default:
      return 4360181; // light blue
  }
}

export const emojis = {
  red: "<:statusred:797222239661457478>",
  orange: "<:statusorange:797222239979700263>",
  yellow: "<:statusyellow:797222239522390056>",
  green: "<:statusgreen:797222239418187786>",
  blue: "<:statusblue:797222239942475786>",
};

export function getStatusEmoji(
  status: Indicator | IncidentStatus | ComponentStatus
): string | undefined {
  switch (status) {
    case "none":
    case "resolved":
    case "operational":
      return emojis.green;

    case "minor":
    case "monitoring":
    case "degraded_performance":
      return emojis.yellow;

    case "major":
    case "partial_outage":
    case "investigating":
      return emojis.orange;

    case "identified":
    case "major_outage":
    case "critical":
      return emojis.red;

    case "postmortem":
      return emojis.blue;
  }
}

export function statusToWords(
  status: Indicator | IncidentStatus | ComponentStatus
): string {
  switch (status) {
    case "degraded_performance":
      return "degraded performance";

    case "partial_outage":
      return "partial outage";

    case "major_outage":
      return "major outage";

    default:
      return status;
  }
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
function trim(input: string): string {
  return input.length > 1024 ? `${input.slice(0, 1020)} ...` : input;
}
