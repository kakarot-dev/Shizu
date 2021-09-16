import Event from "../../struct/Event";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class MessageEvent extends Event {
  constructor() {
    super({
      name: "messageCreate",
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async exec(message: Message) {
    if (!message.guild || !message.guild.me) return;
    if (
      message.content.startsWith("```") &&
      message.guild.me.permissions.has("ATTACH_FILES")
    ) {
      const data = this.client.cache.getIOC(message.guild.id);
      if (!data || !data.enabled) return;
      const message1 = await message.reply({
        embeds: [new MessageEmbed().setDescription("Generating image.....")],
      });
      // eslint-disable-next-line no-useless-escape
      const text = message.content.replace(/\`\`\`(\w+)?/g, "").trim();
      const buffer = await axios({
        url: "https://shizu-carbon.vercel.app/api/cook",
        method: "POST",
        data: {
          code: text,
        },
        responseType: "arraybuffer",
        headers: {
          "Content-type": "application/json",
        },
      }).catch(() => null);

      if (!buffer) {
        await message1.edit({
          content: `A error occurred! The website reported a malformed request`,
          embeds: [],
        });
        return;
      }
      const image = new MessageAttachment(buffer.data, "image.png");
      await message1.edit({ files: [image], embeds: [] });
    } else return;
  }
}

export default MessageEvent;
