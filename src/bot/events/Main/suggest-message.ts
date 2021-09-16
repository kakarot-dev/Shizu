/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Event from "../../struct/Event";
import {
  ColorResolvable,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { guild as schema } from "../../mongoose/schemas/guild";

const status = {
  WAITING: {
    text: "Waiting for Community Feed back",
    color: "ORANGE",
  },
  ACCEPTED: {
    text: "Idea Accepted",
    color: "GREEN",
  },
  DENIED: {
    text: "Idea Denied",
    color: "RED",
  },
};

abstract class MessageEvent extends Event {
  constructor() {
    super({
      name: "messageCreate",
    });
  }

  public async exec(message: Message) {
    if (message.author.bot) return;
    if (!message.guild) return;
    const data = this.client.cache.getSuggestChannel(message.guild.id);
    if (!data) return;
    else if (data) {
      const channel = message.guild.channels.cache.get(
        `${BigInt(data)}`
      ) as TextChannel;
      if (channel) {
        if (channel.id === message.channel.id) {
          if (
            !channel
              .permissionsFor(message.guild?.me!)
              .has("MANAGE_MESSAGES") ||
            !channel.permissionsFor(message.guild?.me!).has("ADD_REACTIONS") ||
            !channel
              .permissionsFor(message.guild?.me!)
              .has("USE_EXTERNAL_EMOJIS")
          )
            return;
          if (message.content.startsWith("//")) return;
          const stats = status.WAITING;

          const embed = new MessageEmbed()
            .setColor(stats.color as ColorResolvable)
            .setTitle(String(message.member?.id))
            .setAuthor(
              String(message.member?.displayName),
              message.member?.user.displayAvatarURL({
                dynamic: true,
              })
            )
            .setDescription(message.content)
            .addFields({
              name: "Status",
              value: stats.text,
            })
            .setFooter(`Want to suggest something? Just type in this channel`);
          await channel.send({ embeds: [embed] }).then((message) => {
            message.react("<:tick:868436462021013504>").then(() => {
              message.react("<:wrong:868437691765755964>");
            });
          });
          await message.delete();
        } else if (!channel) {
          schema.findOneAndUpdate(
            {
              guildId: message.guild.id,
            },
            {
              $unset: {
                suggestChannelId: "",
              },
            }
          );
        }
      }
    }
  }
}

export default MessageEvent;
