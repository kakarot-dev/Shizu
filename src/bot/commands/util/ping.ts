/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";

abstract class PingCommand extends Command {
  protected constructor() {
    super({
      name: "ping",
      aliases: ["p"],
      description: "Pong!",
      category: "util",
      guildOnly: false,
    });
  }

  public async exec(message: Message) {    
    const msg: Message = await message.reply(`Pinging......`);
    const latenc: number = msg.createdTimestamp - message.createdTimestamp;
    const liinks: string[] = [
      "https://cdn.discordapp.com/attachments/468880178744000533/828113918543134761/pong_9.gif",
      "https://cdn.discordapp.com/attachments/468880178744000533/828622948226170920/pong_13.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/828882434040266802/pong_14.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/828882973268901908/pong_11.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/828883137010335754/pong_8.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/829362912463159366/pong_3.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/829362970701070346/pong_2.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/829363033201311764/pong_10.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/829363063815405599/pong_12.gif",
      "https://cdn.discordapp.com/attachments/823797050801913890/829363098086408305/pong_5.gif",
    ];
    const response = liinks[Math.floor(Math.random() * liinks.length)];
    return msg.edit({
      content: `Pong!!! Latency: \`${latenc}ms\` WS: \`${this.client.ws.ping}ms\``,
      embeds: [new MessageEmbed().setImage(response).setColor("YELLOW")],
    });
  }
}

export default PingCommand;
