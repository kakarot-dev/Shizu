/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class BonkCommand extends Command {
  protected constructor() {
    super({
      name: "bonk",
      aliases: [],
      description:
        "Bonk at ur friend the discord way : ) [NSFW should be reported immediately and the command should be be disabled]",
      usage: "<prefix>bonk [person]",
      category: "Action",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  public async exec(message: Message, args: string[]) {
    let target = message.mentions.members?.first() || args[0];
    if (!args[0]) target = "at **air...**";
    const {
      data: { url },
    } = await axios.get(`https://waifu.pics/api/sfw/bonk`);
    const embed = new MessageEmbed()
      .setImage(`${url}`)
      .setDescription(`Aww!! ${message.author} bonked ${target}`)
      .setColor(`#FFC0CB`);
    await message.reply({ embeds: [embed] });
  }
}
export default BonkCommand;
