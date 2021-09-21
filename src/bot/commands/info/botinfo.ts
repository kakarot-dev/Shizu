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
    const embed = new MessageEmbed()
        .setThumbnail(message.client.user?.displayAvatarURL({ dynamic: true }) as string)
        .setTitle("Info on the bot")
        .setDescription(`
        I am a bot who was created to automate and make things easy for a server to moderate or make it active.
        There are a lot of action, moderation and more commands which can be used to the fullest.
        `)
  }
}
export default BotInfoCommand;
