/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class AwooCommand extends Command {
  protected constructor() {
    super({
      name: "awoo",
      aliases: [],
      description: "Cute pics",
      usage: "<prefix>awoo [person]",
      category: "Action",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  public async exec(message: Message /*args: string[], prefix: string*/) {
    const {
      data: { url },
    } = await axios.get(`https://waifu.pics/api/sfw/awoo`);

    const embed = new MessageEmbed()
      .setImage(`${url}`)
      .setDescription(`Cute scary pics ig`)
      .setColor(`#FFC0CB`);
    await message.reply({ embeds: [embed] });
  }
}
export default AwooCommand;
