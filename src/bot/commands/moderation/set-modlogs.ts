/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, TextChannel } from "discord.js";
import { guild as schema } from "../../mongoose/schemas/guild";

abstract class ModLogsCommand extends Command {
  protected constructor() {
    super({
      name: "modlogs",
      aliases: [],
      description: "Set a channel for the mod logs",
      usage: "<prefix>set-modlogs <disable/set> <set-channel>",
      category: "mods",
      cachedData: true,
      cooldown: 10,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: ["MANAGE_WEBHOOKS"],
    });
  }

  public async exec(message: Message, args: string[], prefix: string) {
    const data = this.client.cache.getData(message.guild?.id);
    switch (args[0]) {
      case "set":
        // eslint-disable-next-line no-case-declarations
        if (data && !data.modlogChannelId) {
          const cid =
            message.mentions.channels.first() ??
            message.guild?.channels.cache.get(`${BigInt(args[1])}`);
          if (!cid) {
            return message.reply(
              `Could\\'nt find a channel! Please provide a valid Id`
            );
          }
          if (!(cid instanceof TextChannel)) {
            return message.reply(
              `This is not a valid channel tagged, Make sure this this is a text channel`
            );
          }
          await schema.findOneAndUpdate(
            {
              guildId: message.guild?.id,
            },
            {
              $set: {
                modLogsChannelId: cid.id,
              },
            }
          );
          data.modlogChannelId = cid.id;
          if (cid instanceof TextChannel)
            await cid.createWebhook("Shizu Logger", {
              avatar: `${this.client.user.displayAvatarURL()}`,
              reason: "Needed a Mod Logger",
            });
          message.reply({
            content: `Mod Logs channel set to ${cid}`,
          });
        } else if (data && data.modlogChannelId) {
          message.channel.send({
            content: `This Guild already has a log channel set to <#${data.modlogChannelId}>\nPlease use the same command again, except use the the disable option`,
          });
        }
        break;
      case "disable":
        if (data && !data.modlogChannelId) {
          message.reply({
            content: `This Guild dosent have mod logs set up.\nPlease use this same command again except use the set option`,
          });
        } else if (data && data.modlogChannelId) {
          await schema.findOneAndUpdate(
            {
              guildId: String(message.guild?.id),
            },
            {
              $unset: {
                modLogsChannelId: "",
              },
            }
          );
          data.modlogChannelId = null;
          message.channel.send({
            content: `**Successfuly Reset the Mod Logs System on your Server!**\nPlease use the command again with the set option to re-setup!`,
          });
        }
        break;
      default:
        this.client.commands
          .get("help")
          ?.exec(message, ["set-modlogs"], prefix);
    }
  }
}
export default ModLogsCommand;
