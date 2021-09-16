/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import * as mcapi from "../../struct/mcapi";

abstract class MineCommand extends Command {
  protected constructor() {
    super({
      name: "minecraft",
      aliases: ["mc-user", "mc"],
      description: "Search For Minecraft users",
      usage: "<prefix>mc-user <player-name>",
      category: "misc",
      cooldown: 5,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 1,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[]) {
    const uuid = await mcapi.usernameToUUID(`${args.join(" ")}`);
    const cembed = new MessageEmbed()
      .setTitle(`User: ${args.join(" ")}`)
      .addField("Name:", `${args.join(" ")}`)
      .addField("UUID:", uuid)
      .addField(
        "Download:",
        `[Download](https://minotar.net/download/${args.join(" ")})`,
        true
      )
      .addField(
        "NameMC:",
        `[Click Here](https://mine.ly/${args.join(" ")}.1)`,
        true
      )
      .setImage(
        `https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${args.join(
          " "
        )}/700`
      )
      .setColor("RANDOM")
      .setThumbnail(`https://crafatar.com/renders/body/${uuid}?overlay`);
    message.reply({ embeds: [cembed] });
  }
}
export default MineCommand;
