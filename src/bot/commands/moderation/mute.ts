/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command from "../../struct/Command";
import { Guild, Message, MessageEmbed } from "discord.js";
import ms from "ms";

abstract class MuteCommand extends Command {
  protected constructor() {
    super({
      name: "mute",
      aliases: [],
      description: "Mute someone",
      usage: "<prefix>mute <person> <time> [reason]",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 2,
      userPermissions: ["MANAGE_ROLES"],
      clientPermissions: ["MANAGE_ROLES"],
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async exec(message: Message, args: string[]) {
    const target =
      message.mentions.members?.first() ||
      await message.guild?.members.fetch(`${BigInt(args[0])}`);
    if (!target)
      return message.reply({
        content: "Can't find specefied member! Provide a valid id",
      });
    if (
      message.member &&
      message.member.roles.highest.position <= target.roles.highest.position
    ) {
      if (message.guild?.ownerId !== message.author.id || target.id === message.guild?.ownerId)
        return message.reply({
          content: `The targeted Member aka ${target} is your comarade or is higher than you`,
        });
    }
    const time = ms(args[1]);
    if (isNaN(time) || time > 31557600000)
      return message.reply({
        content: "Pls give me a valid time to mute the person. It should be less than 1 year",
      });
    let reason = args.slice(2).join(" ");
    if (!reason) reason = "triggering the mods";
    const data = await this.client.prisma.mutes.findFirst({
        where: {
            id: BigInt(target.id),
            guildId: message.guild?.id,
        }
    })

    if (data) {
      return message.reply({
        content: `User already muted according to database`,
      });
    }

    const duration = ms(time, {
      long: true,
    });

    const expires = new Date();
    expires.setMilliseconds(expires.getMilliseconds() + time);

    const staff = message.author;

    const mrole = await this.client.cache.muterole(message.guild as Guild);

    if (!mrole)
      return message.reply({
        content: `Could\\'nt find a muted role`,
      });
    const role_added = await target.roles.add(mrole).catch(() => null)
    if (!role_added) {
      await message.reply({
        content: `Could\\'t add muted role. Make sure im above that specified role`,
      });
      return
    }
    await this.client.prisma.mutes.create({
        data: {
            id: BigInt(target.id),
            reason: reason,
            guildId: message.guild?.id,
            expires,
        }
    })

    const chan = new MessageEmbed()
      .setTitle(`Muted`)
      .setColor("RED")
      .setDescription(`**Reason**\n${reason}`)
      .addField(`**Staff**`, `${staff.tag}(${staff.id})`, true)
      .addField(`**Duration**`, `${duration}`, true)
      .setImage(
        target.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setThumbnail(
        `https://cdn.discordapp.com/attachments/820856889574293514/836219858156388372/171403347002202.png`
      );
    const dm = new MessageEmbed()
      .setTitle(`You are muted in ${message.guild?.name}`)
      .setColor("RED")
      .setDescription(`**Reason**\n${reason}`)
      .addField(`**Staff**`, `${staff.tag}(${staff.id})`, true)
      .addField(`**Duration**`, `${duration}`, true)
      .setImage(
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        message.guild?.iconURL({
          dynamic: true,
        })!
      )
      .setThumbnail(
        `https://cdn.discordapp.com/attachments/820856889574293514/836219858156388372/171403347002202.png`
      );
    target
      .send({
        embeds: [dm],
      })
      .catch(() => {
        return;
      });
    await message.channel.send({
      embeds: [chan],
    });
    this.client.emit('muted', target, message.member, reason)
  }
}
export default MuteCommand;
