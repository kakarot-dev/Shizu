/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";

abstract class UptimeCommand extends Command {
  protected constructor() {
    super({
      name: "uptime",
      aliases: ["up"],
      description: "See the uptime of the bot",
      usage: "<prefix>uptime",
      category: "misc",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message /* args: string[] */) {
    const days = Math.floor(this.client.uptime! / 86400000);
    const hours = Math.floor(this.client.uptime! / 3600000) % 24;
    const minutes = Math.floor(this.client.uptime! / 60000) % 60;
    const seconds = Math.floor(this.client.uptime! / 1000) % 60;
    const uptimeE = new MessageEmbed()
      .setTitle(`Uptime of ${this.client.user?.tag}`)
      .setColor("RANDOM")
      .setDescription(
        `\nDays Online: ${days}\nHours Online: ${hours}\nMinute Online: ${minutes}\nSecond Online: ${seconds}`
      )
      .addField("Basic Format", `${days}d ${hours}h ${minutes}m ${seconds}s`)
      .setFooter(`Requested by: ${message.author.username}`);
    message.reply({ embeds: [uptimeE] });
  }
}
export default UptimeCommand;
