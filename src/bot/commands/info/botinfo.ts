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
import os from "os";
const { version } = require(`${process.cwd()}/package.json`);
// import Paginate from "discordjs-paginate";
import { Pagination } from "../../api/Pagination";
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
    const core = os.cpus()[0];
    const hell = new MessageEmbed()
        .setTitle("Bot Info And Stats")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setColor("BLUE")
        .addField(
            "**General**",
            `
										** Client:** ${this.client.user?.tag},
							      ** Servers:** ${this.client.guilds.cache.size},
										** Users:** ${this.client.guilds.cache.reduce(
                (acc, cur) => acc + cur.memberCount,
                0
            )},
										** Channels:** ${this.client.channels.cache.size},
										** Birthday: ** <t:${Math.round(this.client.user?.createdTimestamp / 1000)}:f>,
										** Node.js:** ${process.version},
										** Bot Version:** v${version},
										** Discord.js:** v${djsversion},
										** Commands:** [${this.client.commands.size}]
								`
        );
    const hell2 = new MessageEmbed()
        .setTitle("Computer Info")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setColor("BLUE")
        .addField("**Platform**", `${process.platform}(${os.arch()})`)
        .addField(
            "**CPU**",
            stripIndents(`
			\u3000 \u3000 Cores: ${os.cpus().length},
    		\u3000 Model: ${core.model},
	    	\u3000 Speed: ${core.speed}MHz,
			**Memory:**
		  \u3000 Total: ${await formatBytes(process.memoryUsage().heapTotal)}
		\u3000 Used: ${await formatBytes(process.memoryUsage().heapUsed)}
		`));

    const hell3 = new MessageEmbed()
        .setTitle("Core Info")
        .addField(
            "**Developers**",
            "<@!773193286776389653>, <@!819196421021761567>",
            true
        )
        .addField(
            "**Owners**",
            "<@!518738198982295564>, <@!719807591869317201>",
            true
        )
        .setColor("BLUE")
        .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({
              dynamic: true,
            }),
            `https://discord.com/users/${this.client.user?.id}`
        )
        .setURL(`https://discord.com/users/${this.client.user?.id}`)
        .addField(
            "Invite me (Voidbots)",
            `[Click](https://voidbots.net/bot/${this.client.user?.id}/invite)`,
            false
        )
        .addField(
            "Vote for me (Voidbots)",
            `[Click](https://voidbots.net/bot/${this.client.user?.id}/vote)`,
            false
        );

    const embedarr = [hell, hell2, hell3];

    // const embeds = new Paginate(embedarr, message, {
    //   appendPageInfo: true,
    //   timeout: 60000,
    //   previousbtn: "841961355799691264",
    //   nextbtn: "841961438884003870",
    //   stopbtn: "841962179490349068",
    //   // removeUserReactions: message.channel.type !== 'dm'
    //   removeUserReactions: false,
    //   removeAllReactions: false,
    // });
    // await embeds.exec();
    await new Pagination(
        message,
        message.channel as TextChannel,
        embedarr,
        "Page"
    ).paginate();
  }
}
export default BotInfoCommand;

async function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
