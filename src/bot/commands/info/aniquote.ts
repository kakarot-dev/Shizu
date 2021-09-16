/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import aq from "../../struct/aniquote";

abstract class AnimeQuoteCommand extends Command {
  protected constructor() {
    super({
      name: "aniquote",
      aliases: [],
      description: "Anime quotes",
      usage: "<prefix>aniquote",
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
    const { quotenumber, quotesentence, quotecharacter, quoteanime } =
      await aq();
    const res =
      (await this.client.kitsu.searchAnime(quoteanime, 0).catch(() => null)) ??
      [];
    const image = res[0].posterImage.original;
    const text = `***Quoted from ${quoteanime}***\n${quotesentence}\n\n-*${quotecharacter}*`;
    const embed = new MessageEmbed()
      .setDescription(text)
      .setThumbnail(image)
      .setColor("BLUE")
      .setAuthor(String(quotenumber));
    await message.channel.send({
      embeds: [embed],
    });
  }
}
export default AnimeQuoteCommand;
