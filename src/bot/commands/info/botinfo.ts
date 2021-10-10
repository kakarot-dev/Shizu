/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Command from "../../struct/Command";
import {
  Message,
  MessageEmbed,
  TextChannel,
  version as djsversion,
} from "discord.js";
import {release, cpus} from "os";
const { version } = require(`${process.cwd()}/package.json`);
// import Paginate from "discordjs-paginate";
import {stripIndents} from "common-tags";

abstract class BotInfoCommand extends Command {
  protected constructor() {
    super({
      name: "bot",
      aliases: ["btinfo", "bt", "botinfo"],
      description: "Get info about the bot",
      usage: "<prefix>bot",
      category: "info",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, _args: string[]) {
    const { heapUsed, heapTotal } = process.memoryUsage();
    const msgscach = this.compact(message.client.channels.cache.filter(x => x.isText() && x instanceof TextChannel).reduce((m,c) => m + (c as TextChannel).messages.cache.size, 0));
    const usrtotal = this.compact(message.client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0));
    const usrcachd = this.compact(message.client.users.cache.size);
    const memtotal = `[\`${(heapTotal / 1024 / 1024).toFixed(0)} MB\`]`;
    const memoused = `[\`${(heapUsed  / 1024 / 1024).toFixed(0)} MB\`]`;
    const systemos = `**${process.platform} ${release}**`;
    const discordv = `**${djsversion}**`;
    const nodevers = `**${process.version}**`;
    const systmcpu = `**${cpus()[0].model}**`;
    const embed = new MessageEmbed()
        .setThumbnail(message.client.user?.displayAvatarURL({ dynamic: true }) as string)
        .setTitle(`${message.client.user?.username} v${version}`)
        .setDescription(stripIndents(`
        Your cute waifu to help you out within discord.
        Serving ${this.client.guilds.cache.size} on shard 0
        `))
        .addFields([
          {
            name: "📧\u2000Messages in Cache",
            value: stripIndents(`
            Total: ${msgscach} 
            `),
            inline: true
          },
          {
            name: "👥\u2000Users",
            value: stripIndents(`
            Total:\u2000**${usrtotal}**
            Cached:\u2000**${usrcachd}**
            `),
            inline: true
          },
          {
            name: "📝\u2000Memory",
            value: stripIndents(`
            Total:\u2000**${memtotal}**
            Used:\u2000**${memoused}**
            `),
            inline: true
          },
          {
            name: "💻\u2000System",
            value: stripIndents(`
            OS:\u2000**${systemos}**
            Discordjs:\u2000**${discordv}**
            Node:\u2000**${nodevers}**
            CPU:\u2000**${systmcpu}**
            `),
            inline: true
          }
        ])

    await message.channel.send({
      embeds: [embed]
    })
  }
  compact(number, maximumFractionDigits = 2) {
    return Number(number || '').toLocaleString('en-US', {notation: 'compact', maximumFractionDigits});
  }
}
export default BotInfoCommand;
