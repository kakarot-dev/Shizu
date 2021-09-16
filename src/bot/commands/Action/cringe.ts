/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class CringeCommand extends Command {
  protected constructor() {
    super({
      name: "cringe",
      aliases: [],
      description:
        "Cringe at ur friend the discord way : ) [NSFW should be reported immediately and the command should be be disabled]",
      usage: "<prefix>cringe [person]",
      category: "Action",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  public async exec(message: Message) {
    const {
      data: { url },
    } = await axios.get(`https://waifu.pics/api/sfw/cringe`);
    const embed = new MessageEmbed()
      .setImage(`${url}`)
      .setDescription(`Aww!! ${message.author} is cringing`)
      .setColor(`#FFC0CB`);
    await message.reply({ embeds: [embed] });
  }
}
export default CringeCommand;
