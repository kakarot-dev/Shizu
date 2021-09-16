import Command from "../../struct/Command";
import { Message, TextChannel } from "discord.js";
import { guild as schema } from "../../mongoose/schemas/guild";

abstract class setDiscordStatusCommand extends Command {
  protected constructor() {
    super({
      name: "discordstatus",
      aliases: ["discord-status", "set-ds"],
      description: "Set a channel for discord Status",
      usage: "<prefix>set-discordStatus <disable/set> <set-channel>",
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

  public async exec(
    message: Message,
    args: string[],
    prefix: string
  ): Promise<void> {
    // console.log(message)
    const Data = await schema.findOne({
      guildId: message.guild?.id,
      statusChannelId: { $exists: true },
    });
    switch (args[0]) {
      case "set":
        if (!Data) {
          const cid =
            message.mentions.channels.first() ??
            message.guild?.channels.cache.get(`${BigInt(args[1])}`);
          if (!cid) {
            message.reply(
              `Could\\'nt find a channel! Please provide a valid Id`
            );
            return;
          }
          await schema.findOneAndUpdate(
            {
              guildId: message.guild?.id,
            },
            {
              $set: {
                statusChannelId: cid.id,
              },
            }
          );
          if (cid instanceof TextChannel) {
            await cid.createWebhook("Shizu Discord Status", {
              avatar:
                "https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png",
              reason: "Needed a Discord Logger",
            });
            await message.reply({
              content: `Status Logs channel set to ${cid}`,
            });
          } else {
            message.channel.send({
              content: `This Channel is not a text channel\nMake Sure it is.`,
            });
          }
        } else {
          await message.channel.send({
            content: `This Guild already has a log channel set to <#${Data.statusChannelId}>\nPlease use the same command again, except use the the disable option`,
          });
        }
        break;
      case "disable":
        if (!Data) {
          message.reply({
            content: `This Guild dosent have Discord Logs set up.\nPlease use this same command again except use the set option`,
          });
          return;
        } else {
          await schema.findOneAndUpdate(
            {
              guildId: message.guild?.id,
            },
            {
              $unset: {
                statusChannelId: "",
              },
            }
          );
          await message.channel.send({
            content: `**Successfuly Reset the Discord Logs System on your Server!**\nPlease use this command again to re-setup!`,
          });
        }
        break;
      default:
        this.client.commands
          .get("help")
          ?.exec(message, ["set-discordStatus"], prefix);
    }
  }
}
export default setDiscordStatusCommand;
