/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageEmbed,
} from "discord.js";
import Interaction from "../../struct/Interaction";
import axios from "axios";

abstract class ChatInteraction extends Interaction {
  constructor() {
    super({
      name: "chat",
      description: "Chat with the bot",
      cooldown: 2,
      options: [
        {
          type: "STRING",
          name: "text",
          description: "Text to chat lmao",
          required: true,
        },
      ],
    });
  }

  public async exec(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const text = args.getString("text") as string;
    axios
      .get(
        `https://aria-api.up.railway.app/misc/chat?msg=${encodeURIComponent(
          text
        )}&uid=${interaction.user.id}`,
        {
          headers: {
            auth: process.env.CHAT ?? "NULL",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`${data.message}`);
        interaction.reply({
          embeds: [embed],
        });
      });
  }
}

export default ChatInteraction;
