/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";

abstract class SlowmodeCommand extends Command {
  protected constructor() {
    super({
      name: "slowmode",
      aliases: ["slow"],
      description: "Add/Remove slowmode for a channel",
      usage: "<prefix>slow <number>",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    });
  }

  public async exec(message: Message, arg: string[]) {
    const user = message.member?.user;
    const channel = message.channel as TextChannel;
    const time = Number(arg[0]);
    if (isNaN(time)) {
      const NONOMBER = new MessageEmbed()
        .setAuthor(
          `${this.client.user.username}`,
          `${this.client.user.displayAvatarURL({ dynamic: true })}`
        )
        .setDescription(`❎ ${user?.username}, please give me a number`)
        .setColor(`#ff3d3d`)
        .setFooter(
          `Requested by: ${message.author.username}`,
          user?.displayAvatarURL()
        )
        .setTimestamp();
      message.channel.send({
        embeds: [NONOMBER],
      });
      return;
    }

    if (time <= 0) {
      await channel.setRateLimitPerUser(0);
      const DISS = new MessageEmbed()
        .setAuthor(
          `${this.client.user.username}`,
          `${this.client.user.displayAvatarURL({ dynamic: true })}`
        )
        .setDescription(`✅ ${user?.username}, slowmode has been removed`)
        .setColor(`#3cf05a`)
        .setFooter(
          `Requested by: ${message.author.username}`,
          user?.displayAvatarURL()
        )
        .setTimestamp();
      await message.channel.send({
        embeds: [DISS],
      });
    }
    if (time > 21600) {
      const TOBIG = new MessageEmbed()
        .setAuthor(
          `${this.client.user.username}`,
          `${this.client.user.displayAvatarURL({ dynamic: true })}`
        )
        .setDescription(
          `❎ ${user?.username}, please give me a number between 0 and 21600`
        )
        .setColor(`#ff3d3d`)
        .setFooter(
          `Requested by: ${message.author.username}`,
          user?.displayAvatarURL()
        )
        .setTimestamp();
      return message.channel.send({
        embeds: [TOBIG],
      });
    }
    if (time >= 1) {
      await channel.setRateLimitPerUser(time);
      const ACT = new MessageEmbed()
        .setAuthor(
          `${this.client.user.username}`,
          `${this.client.user.displayAvatarURL({ dynamic: true })}`
        )
        .setDescription(
          `✅ ${user?.username}, slowmode has been set to ${time} secconds`
        )
        .setColor(`#3cf05a`)
        .setFooter(
          `Requested by: ${message.author.username}`,
          user?.displayAvatarURL()
        )
        .setTimestamp();
      await message.channel.send({
        embeds: [ACT],
      });
    }
  }
}
export default SlowmodeCommand;
