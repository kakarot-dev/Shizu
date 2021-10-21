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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const emojis = require('../../../../emojis.json')

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
  protected constructor() {
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
      const channel = await message.guild.channels.fetch(
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
            message.react(emojis.yea).then(() => {
              message.react(emojis.wrong);
            });
          });
          await message.delete();
        } else if (!channel) {
          const data = await this.client.prisma.server.update({
            where: {
              id: BigInt(message.guild.id)
            },
            data: {
              suggestChannelId: null
            }
          });
          this.client.cache.data.set(message.guild.id, data)
        }
      }
    }
  }
}

export default MessageEvent;
