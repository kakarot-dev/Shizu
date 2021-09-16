/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Pagination } from "../../api/Pagination";

abstract class WaifuCommand extends Command {
  protected constructor() {
    super({
      name: "waifu",
      aliases: [],
      description:
        "Waifu's : ) [NSFW should be reported immediately and the command should be disabled]",
      usage:
        "<prefix>waifu [best/popular/trash/search/<info>] [[best/popular/trash/search/]]",
      category: "Action",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  public async exec(message: Message, args: string[]) {
    switch (args[0]) {
      case "info":
        {
          switch (args[1]) {
            case "random":
              {
                const data = await this.client.waifu.fetch('randomwaifu');
                const embed = this.client.waifu.createInfoEmbed(data);
                await message.reply({embeds: [embed]});
              }
              break;
            case "best":
              {
                const data = await this.client.waifu.fetch('bestwaifusthisseason');
                const arr: MessageEmbed[] = [];
                if (data.length === 0) {
                  await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.client.waifu.createInfoEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
            case "popular":
              {
                const data = await this.client.waifu.fetch('popularwaifusthisseason')
                const arr: MessageEmbed[] = [];
                if (data.length === 0) {
                  await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.client.waifu.createInfoEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
            case "trash":
              {
                const data = await this.client.waifu.fetch('trashwaifusthisseason')
                const arr: MessageEmbed[] = [];
                if (data.length === 0) {
                  await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.client.waifu.createInfoEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
            case "search":
              {
                args.shift();
                args.shift();
                const arr: MessageEmbed[] = [];
                const data = await this.client.waifu.fetch("search&choose=" +
                args.join(" "))
                if (data.length === 0) {
                 await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.client.waifu.createInfoEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
          }
        }
        break;
      default:
        {
          switch (args[0]) {
            case undefined:
              {
                const data = await this.client.waifu.fetch('randomwaifu');
                const embed = this.createImageEmbed(data);
               await message.reply({ embeds: [embed] });
              }
              break;
            case "best":
              {
                const arr: MessageEmbed[] = [];
                const data = await this.client.waifu.fetch('bestwaifusthisseason');
                if (data.length === 0) {
                  await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.createImageEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
            case "popular":
              {
                const arr: MessageEmbed[] = [];
                const data = await this.client.waifu.fetch('popularwaifusthisseason');
                if (data.length === 0) {
                  await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.createImageEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
            case "trash":
              {
                const arr: MessageEmbed[] = [];
                const data = await this.client.waifu.fetch('trashwaifusthisseason');
                if (data.length === 0) {
                  await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.createImageEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
            case "search":
              {
                args.shift();
                const arr: MessageEmbed[] = [];
                const data = await this.client.waifu.fetch("search&choose=" +
                    args.join(" "))
                if (data.length === 0) {
                  await message.reply("No data received.");
                  return;
                }
                data.forEach((data) => {
                  const embed = this.createImageEmbed(data);
                  arr.push(embed);
                });
                await new Pagination(
                  message,
                  message.channel as TextChannel,
                  arr,
                  "Page"
                ).paginate();
                // const embed = this.createEmbed(data);
                // message.reply({ embeds: [embed] });
              }
              break;
            default:
            {
              const data = await this.client.waifu.fetch('randomwaifu');
              const embed = this.createImageEmbed(data);
              await message.reply({ embeds: [embed] });
            }
          }
        }
        break;
    }
  }

  createImageEmbed(data): MessageEmbed {
    return new MessageEmbed()
      .setColor("BLUE")
      .setURL(data.url)
      .setTitle(data.name)
      .setImage(data.display_picture)
      .setFooter(`❣️ ${data.likes} likes | 💔 ${data.trash} trash`);
  }
}
export default WaifuCommand;
