/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class ApiUnbanCommand extends Command {
  protected constructor() {
    super({
      name: "api-unban",
      aliases: [],
      description: "UnBan pople from the api",
      usage: "<prefix>api-unban",
      category: "Devs",
      cooldown: 2,
      ownerOnly: true,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: Array<string>) {
    const response = await axios({
      url: `https://aria-api.up.railway.app/admin/unban?ID=${args[0]}`,
      method: "GET",
      headers: {
        auth: process.env.MAIN ?? "null",
      },
    }).catch(() => null);
    if (!response)
      return message.channel.send({
        content: `The api responded with a response which is not valid`,
      });
    const key = await response.data;
    console.log(key);
    const embed = new MessageEmbed()
      .setDescription(key.message)
      .setColor("RANDOM");
    return message.channel.send({
      embeds: [embed],
    });
  }
}
export default ApiUnbanCommand;
