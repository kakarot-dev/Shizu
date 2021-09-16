import Bot from "../api/Client";
import { Guild, GuildMember, TextChannel, User, Webhook } from "discord.js";
import { guild as schema } from "../mongoose/schemas/guild";

async function log(guild: Guild, client: Bot): Promise<void | Webhook> {
  const data = client.cache.getModChannel(guild.id);
  if (!data) return;
  const channel = guild.channels.cache.get(`${BigInt(data)}`) as TextChannel;
  const arr: Webhook[] = [];
  if (
    !channel ||
    !channel.permissionsFor(guild?.me as GuildMember).has("MANAGE_WEBHOOKS")
  ) {
    await schema.findOneAndUpdate(
      {
        guildId: guild.id,
      },
      {
        $unset: {
          modLogsChannelId: "",
        },
      }
    );
    const owner = await guild.fetchOwner();
    const data = client.cache.getData(guild.id);
    if (data) data.modlogChannelId = null;
    await owner.user
      .send({
        content: `I wasnt able to get a webhook from the channel with the id ${data} for the mod Logs\nI have **reset** the Mod Logs\nI dont have Perms for manage webhooks, pls make sure I have that permission`,
      })
      .catch(() => null);
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
        .catch(() => null);
      if (!web) {
        await schema.findOneAndUpdate(
          {
            guildId: guild.id,
          },
          {
            $unset: {
              modLogsChannelId: "",
            },
          }
        );
        const owner = await guild.fetchOwner();
        await owner.user
          .send({
            content: `I wasnt able to get a webhook from the channel with the id ${data} for the mod Logs\nI have **reset** the Mod Logs`,
          })
          .catch(() => null);
        return;
      }
      arr[0] = web;
    } else {
      const logger = webhook.first();
      arr[0] = logger as Webhook;
    }
  }
  return arr[0];
}

export { log };
