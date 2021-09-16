/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class ballCommand extends Command {
  protected constructor() {
    super({
      name: "gen",
      aliases: [],
      description: "Generate a api key",
      usage: "<prefix>gen",
      category: "misc",
      cooldown: 100,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message /* args: string[]*/) {
    const quota = message.guild?.id !== "831095167809093672" ? 700 : 1200;
    const response = await axios
      .get(
        `https://aria-api.up.railway.app/admin/gen?ID=${message.author.id}&quota=${quota}`,
        {
          headers: {
            auth: process.env.MAIN ?? "null",
          },
        }
      )
      .catch(() => null);
    if (!response)
      return message.channel.send({
        content: `The api responded with a response which is not valid`,
      });
    const key = await response.data;
    console.log(key);
    const embed = new MessageEmbed()
      .setDescription(
        `Your Api key has been generated => ||${key.id}|| with ${quota} per minute`
      )
      .setFooter(key.message)
      .addField(
        `EndPoints`,
        `
            There are two endpoints for now
            https://aria-api.up.railway.app/misc/chat?msg=()&uid=()
            https://aria-api.up.railway.app/misc/fliptext?text=()
            `
      )
      .setColor("RANDOM");
    return message.author.send({
      embeds: [embed],
    });
  }
}
export default ballCommand;
