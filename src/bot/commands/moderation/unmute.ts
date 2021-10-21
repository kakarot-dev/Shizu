/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Guild, Message, MessageEmbed } from "discord.js";

abstract class MuteCommand extends Command {
  protected constructor() {
    super({
      name: "unmute",
      aliases: [],
      description: "UnMute someone",
      usage: "<prefix>unmute <person> [reason]",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
      clientPermissions: [
        "MANAGE_MESSAGES",
        "MANAGE_ROLES",
      ],
    });
  }

  public async exec(message: Message, args: string[]) {
    const staff2 = message.author;
    const target =
      message.mentions.members?.first() ??
      await message.guild?.members.fetch(`${BigInt(args[0])}`);
    if (!target)
      return message.reply({
        content: "Can't find specefied member! Provide a valid id",
      });
    if (
      message.member &&
      message.member.roles.highest.position <= target.roles.highest.position
    ) {
      if (message.guild?.ownerId !== message.author.id)
        return message.reply({
          content: `The targeted Member aka ${target} is your comarade or is higher than you`,
        });
    }
    let reason = args.slice(2).join(" ");
    if (!reason) reason = "triggering the mods";
    const mrole = await this.client.cache.muterole(message.guild as Guild);

      if (!mrole)
        return message.reply({
          content: `Could\\'nt find the muted role`,
        });
      await this.client.prisma.mutes.deleteMany({
        where: {
            id: BigInt(target.id),
            guildId: message.guild?.id as string,
        }
    })
      const removed = target.roles.remove(mrole).catch(() => null);
      if (!removed) {
        return message.reply({
          content: `Could\\'t remove muted role. Make sure im above that specified role`,
        });
      }

      const chan = new MessageEmbed()
        .setTitle(`UnMuted`)
        .setColor("GREEN")
        .setDescription(`**Reason**\n${reason}`)
        .addField(`**Staff**`, `${staff2.tag}(${staff2.id})`, true)
        .setThumbnail(
          `https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`
        )
        .setImage(
          target.user.displayAvatarURL({
            dynamic: true,
          })
        );

      const dm = new MessageEmbed()
        .setTitle(`You are Unmuted in ${message.guild?.name}`)
        .setColor("GREEN")
        .setDescription(`**Reason**\n${reason}`)
        .addField(`**Staff**`, `${staff2.tag}(${staff2.id})`, true)
        .setThumbnail(
          `https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`
        )
        .setImage(
          message.guild?.iconURL({
            dynamic: true,
          })!
        );
      target.send({ embeds: [dm] }).catch(() => {
        return;
      });
      await message.channel.send({ embeds: [chan] });
  }
}
export default MuteCommand;
