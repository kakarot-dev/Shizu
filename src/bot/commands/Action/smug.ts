/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class SmugCommand extends Command {
  protected constructor() {
    super({
      name: "smug",
      aliases: [],
      description:
        "Smug at ur friends : ) [NSFW should be reported immediately and the command should be be disabled]",
      usage: "<prefix>smug [person]",
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
    } = await axios.get(`https://waifu.pics/api/sfw/smug`);
    const embed = new MessageEmbed()
      .setImage(`${url}`)
      .setDescription(`Aww!! ${message.author} sumgged ${target}`)
      .setColor(`#FFC0CB`);
    await message.reply({ embeds: [embed] });
  }
}
export default SmugCommand;
