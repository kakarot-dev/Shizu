/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";

abstract class AFKCommand extends Command {
  protected constructor() {
    super({
      name: "afk",
      aliases: [],
      description: "Set Afk message for a guild",
      usage: "<prefix>afk [message]",
      category: "misc",
      cooldown: 3,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  public async exec(message: Message, args: string[]) {
    if (message.guild) {
      let afkMessage = args.join(" ");
      const userId = message.author?.id;
      const guildId = message.guild?.id;

      const embed = new MessageEmbed();

      if (!afkMessage) {
        afkMessage = "AFK"; // Define AFK message
      }
     const data =  await this.client.prisma.afk.create({
        data: {
          id: BigInt(userId),
          guildId: String(guildId),
          afk: afkMessage,
          timestamp: new Date().getTime(),
          username: message.member?.nickname === null
              ? message.author.username
              : message.member?.nickname
        }
      }).catch(() => null);

      if (!data) {
        await message.channel.send({
          embeds: [
            {
              description: "Error in saving data to the db.",
              title: "Error",
              color: "RED"
            }
          ]
        })
      }

      await message.member
        ?.setNickname(
          `[AFK] ${
            message.member.nickname === null
              ? `${message.author.username}`
              : `${message.member.nickname}`
          }`
          /* eslint-disable @typescript-eslint/no-empty-function */
        )
        .catch(() => {}); // In case bot doesnt have perms

      return message.channel.send({
        embeds: [
          embed
            .setColor(message.guild?.me!.displayHexColor as ColorResolvable)
            .setAuthor(
              "Your AFK Message Has Been Set",
              message.author.displayAvatarURL()
            )
            .setDescription(`<a:bounce:831518713333022736> ${afkMessage}`)
            .setTimestamp(),
        ],
      });
    }
  }
}
export default AFKCommand;
