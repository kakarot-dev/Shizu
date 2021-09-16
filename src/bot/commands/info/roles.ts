/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import _ from "lodash";

abstract class DiscordJsCommand extends Command {
  protected constructor() {
    super({
      name: "roles",
      aliases: ["listroles"],
      description: "Show the roles",
      usage: "<prefix>roles",
      category: "info",
      cooldown: 2,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message /*args: string[]*/) {
    if (!message.guild) return;
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("GREY")
          .setAuthor(`${message.guild?.name} Roles List`)
          .addFields(
            _.chunk(
              [...message.guild?.roles.cache.values()]
                .filter((x) => x.id !== message.guild?.id)
                .sort((A, B) => B.rawPosition - A.rawPosition),
              10
            ).map((x) => {
              return {
                name: "\u200b",
                inline: true,
                value: "\u200b" + x.map((x) => `\u2000❯ ${x}`).join("\n"),
              };
            })
          ),
      ],
    });
  }
}
export default DiscordJsCommand;
