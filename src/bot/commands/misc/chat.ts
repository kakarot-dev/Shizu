/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class ChatCommand extends Command {
  protected constructor() {
    super({
      name: "chat",
      aliases: [],
      description: "Chat with the bot through monke dev",
      usage: "<prefix>chat <search term>",
      category: "misc",
      cooldown: 2,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 1,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: string[]) {
    const text = args.join(" ");
    axios
      .get(
        `https://aria-api.up.railway.app/misc/chat?msg=${encodeURIComponent(
          text
        )}&uid=${message.author.id}`,
        {
          headers: {
            auth: process.env.CHAT ?? "NULL",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        const embed = new MessageEmbed().setDescription(`${data.message}`);
        message.reply({
          embeds: [embed],
        });
      });
  }
}
export default ChatCommand;
