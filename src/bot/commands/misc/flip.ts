/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import flip from "../../struct/flip-text/flip";

abstract class FlipCommand extends Command {
  protected constructor() {
    super({
      name: "flip",
      aliases: [],
      description: "Flip text",
      usage: "<prefix>flip <term>",
      category: "misc",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: string[]) {
    const flipped: string[] = [];

    args.forEach(async (args: string) => {
      flipped.push(flip(args));
    });

    const embeds = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Flipped text")
      .setDescription(flipped.join(" "))
      .setTimestamp();
    await message.reply({
      embeds: [embeds],
      allowedMentions: {
        repliedUser: false,
      },
    });
  }
}
export default FlipCommand;
