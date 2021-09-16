/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class ShinobuCommand extends Command {
  protected constructor() {
    super({
      name: "shinobu",
      aliases: [],
      description:
        "Kawaii Shinonu : ) [NSFW should be reported immediately and the command should be be disabled]",
      usage: "<prefix>shinobu",
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
    } = await axios.get(`https://waifu.pics/api/sfw/shinobu`);
    const embed = new MessageEmbed().setImage(`${url}`).setColor(`#FFC0CB`);
    await message.reply({ embeds: [embed] });
  }
}
export default ShinobuCommand;
