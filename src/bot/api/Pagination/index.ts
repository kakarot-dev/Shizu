import {
  DMChannel,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { ButtonOption } from "./types/ButtonOption";
import Bot from '../Client';
//const availableEmojis = ["⏮️", "◀️", "⏹️", "▶️", "⏭️"];
const availableEmojis = [
  Bot.emoji.left,
  Bot.emoji.pause,
  Bot.emoji.right,
  Bot.emoji.delete
];

class Pagination {
  private message?: Message;
  private readonly channel: TextChannel | DMChannel;
  private readonly pages: MessageEmbed[];
  private index = 0;
  private deleted = false;
  timeout: number | undefined;
  rmsg: Message;

  constructor(
    message: Message,
    channel: TextChannel | DMChannel,
    pages: MessageEmbed[],
    footerText = "Page",
    timeout?: number,
    options?: ButtonOption[]
  ) {
    this.timeout = timeout;
    this.rmsg = message;
    if (options && options.length > 5) {
      throw new TypeError("You have passed more than 5 buttons as options");
    } else if (options && options.length < 4) {
      throw new TypeError("You have passed less than 5 buttons as options");
    }
    this.channel = channel;
    this.pages = pages.map((page, pageIndex) => {
      if (page.author && page.author.name) return page;
      return page.setAuthor(
        `${footerText} ${pageIndex + 1} of ${pages.length}`
      );
    });
  }

  /**
   * Starts the pagination
   */
  async paginate(): Promise<void> {

    if (this.pages.length <= 1) {
      this.message = await this.channel.send({
        embeds: [this.pages[this.index]],
      });
      return;
    }
    this.message = await this.channel.send({
      embeds: [this.pages[this.index]],
      components: [this.buttons(false)],
    });
    const filter = (interaction: Interaction) => {
      if (
        interaction.user.id !== this.rmsg.author.id &&
        interaction.isMessageComponent()
      ) {
        interaction.reply({
          content: `You cant use the pagination on this embed.\nPlease use the command \`${this.rmsg.content}\` to get your own embed.`,
          ephemeral: true,
        });
        return false;
      } else return true;
    };
    const interactionCollector = this.message.createMessageComponentCollector({
      filter,
      idle: 1000 * 60,
      dispose: false,
    });

    interactionCollector.on("collect", async (interaction) => {
      const { customId } = interaction;
      switch (customId) {
        case availableEmojis[0]:
          // Prev
          this.index--;
          if (this.index <= 0) this.index = this.pages.length - 1;
          await interaction.update({
            embeds: [this.pages[this.index]],
          });
          break;
        case availableEmojis[1]:
          // Stop
          this.deleted = true;
          interactionCollector.stop("stopped by user");
          await interaction.update({
            components: [this.buttons(true)],
          });
          break;
        case availableEmojis[2]:
          // Next
          this.index++;
          if (this.index >= this.pages.length) {
            this.index = 0;
          }
          await interaction.update({
            embeds: [this.pages[this.index]],
          });
          break;
        case availableEmojis[3]:
          this.deleted = true;
          this.message?.edit({
            embeds: [],
            content: `Deleted the embed from continuing further\nCommand used \`${this.rmsg.content}\` by ${this.rmsg.author}`,
            components: [],
          });
          break;
      }
    });
    interactionCollector.on("end", async () => {
      if (this.deleted) return;
      await this?.message?.edit({
        components: [this.buttons(true)],
      });
    });
  }

  buttons(disabled: boolean): MessageActionRow {
    return new MessageActionRow()
     .addComponents([
      new MessageButton()
        .setDisabled(disabled)
        .setStyle("PRIMARY")
        .setEmoji(availableEmojis[0])
        .setCustomId(availableEmojis[0]),
      new MessageButton()
        .setDisabled(disabled)
        .setStyle("DANGER")
        .setEmoji(availableEmojis[1])
        .setCustomId(availableEmojis[1]),
      new MessageButton()
        .setDisabled(disabled)
        .setStyle("PRIMARY")
        .setEmoji(availableEmojis[2])
        .setCustomId(availableEmojis[2]),
      new MessageButton()
        .setDisabled(disabled)
        .setStyle("DANGER")
        .setEmoji(availableEmojis[3])
        .setCustomId(availableEmojis[3]),
    ]);
  }
}

export { ButtonOption, Pagination };
