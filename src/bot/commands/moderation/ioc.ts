/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message } from "discord.js";
import { guild as schema } from "../../mongoose/schemas/guild";

abstract class iocCommand extends Command {
  protected constructor() {
    super({
      name: "ioc",
      aliases: [],
      description: "Enable or disable image of code",
      usage: "<prefix>ioc <enable/disable>",
      category: "mods",
      cachedData: true,
      cooldown: 10,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: ["ATTACH_FILES"],
    });
  }

  public async exec(message: Message, args: string[], prefix: string) {
    const data = this.client.cache.getData(message.guild?.id);
    switch (args[0]) {
      case "enable":
        // eslint-disable-next-line no-case-declarations
        if (data && !data.ioc?.enabled) {
          await schema.findOneAndUpdate(
            {
              guildId: message.guild?.id,
            },
            {
              $set: {
                ioc: {
                  enabled: true,
                  color: "auto",
                },
              },
            }
          );
          data.ioc = {
            enabled: true,
            color: "no",
          };
          message.reply({
            content: `Enabled the system of image to code`,
          });
        } else if (data && data.ioc?.enabled) {
          message.channel.send({
            content: `This Guild already has enabled ioc\nPlease use the same command again, except use the the disable option`,
          });
        }
        break;
      case "disable":
        if (data && !data.ioc?.enabled) {
          message.reply({
            content: `This Guild dosent have ioc set.\nPlease use this same command again except use the enable option`,
          });
        } else if (data && data.ioc?.enabled) {
          await schema.findOneAndUpdate(
            {
              guildId: String(message.guild?.id),
            },
            {
              $set: {
                ioc: {
                  enabled: false,
                  color: "no",
                },
              },
            }
          );
          data.ioc = {
            enabled: true,
            color: "no",
          };
          message.channel.send({
            content: `Disabled the system of ioc`,
          });
        }
        break;
      default:
        this.client.commands.get("help")?.exec(message, ["ioc"], prefix);
    }
  }
}
export default iocCommand;
