/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class YeetCommand extends Command {
  protected constructor() {
    super({
      name: "yeet",
      aliases: [],
      description:
        "yeet ur friends the discord way : ) [NSFW should be reported immediately and the command should be be disabled]",
      usage: "<prefix>yeet[person]",
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
    let target = (message.mentions.members?.map<string>(member => `<@!${member.id}>`).join(', ').trim()) + '🎶'
    if (!args[0]) target = "**air...**";
    const {
      data: { url },
    } = await axios.get(`https://waifu.pics/api/sfw/yeet`);
    const embed = new MessageEmbed()
      .setImage(`${url}`)
      .setDescription(`Aww!! ${message.author} yeets ${target}`)
      .setColor(`#FFC0CB`);
    await message.reply({ embeds: [embed] });
  }
}
export default YeetCommand;
