import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class WaifuPicsCommand extends Command {
  protected constructor() {
    super({
      name: "waifu.pics",
      aliases: [],
      description:
        "Waifu's : ) [NSFW should be reported immediately and the command should be be disabled]",
      usage: "<prefix>waifu.pics",
      category: "Action",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async exec(message: Message) {
    const {
      data: { url },
    } = await axios.get(`https://waifu.pics/api/sfw/waifu`);
    const embed = new MessageEmbed().setImage(`${url}`).setColor(`#FFC0CB`);
    await message.reply({ embeds: [embed] });
  }
}
export default WaifuPicsCommand;
