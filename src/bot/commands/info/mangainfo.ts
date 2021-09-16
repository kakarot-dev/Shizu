/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-useless-escape */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";
// import Paginate from "discordjs-paginate";
import { Pagination } from "../../api/Pagination";

abstract class MangaInfoCommand extends Command {
  protected constructor() {
    super({
      name: "mangainfo",
      aliases: ["manga"],
      description: "Search For an manga",
      usage: "<prefix>manga <search term>",
      category: "info",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[]) {
    const search = args.join(" ");

    this.client.kitsu.searchManga(search).then(async (result) => {
      if (result.length === 0) {
        return message.channel.send(
          `No search results found for **${search}**!`
        );
      }

      const arr: MessageEmbed[] = [];
      result.forEach(async (manga) => {
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor(
            `${manga.titles.english ? manga.titles.english : search}`,
            manga.posterImage.original
          )
          .setTitle(`${manga.titles.english ? manga.titles.english : search}`)
          .setURL(`https://kitsu.io/manga/${manga.slug}`)
          .setDescription(manga.synopsis.replace(/<[^>]*>/g, "").split("\n")[0])
          .addField(
            "❯\u2000Information",
            `•\u2000\**Japanese Name:** ${
              manga.titles.romaji
            }\n\•\u2000\**Age Rating:** ${
              manga.ageRating ? manga.ageRating : "`N/A`"
            }\n\•\u2000\**Chapters:** ${
              manga.chapterCount ? manga.chapterCount : "`N/A`"
            }`,
            false
          )
          .addField(
            "❯\u2000Stats",
            `•\u2000\**Average Rating:** ${
              manga.averageRating ? manga.averageRating : "`N/A`"
            }\n\•\u2000\**Rating Rank:** ${
              manga.ratingRank ? manga.ratingRank : "`N/A`"
            }\n\•\u2000\**Popularity Rank:** ${
              manga.popularityRank ? manga.popularityRank : "`N/A`"
            }`,
            true
          )
          .addField(
            "❯\u2000Status",
            `•\u2000\**Volumes:** ${
              manga.volumeCount ? manga.volumeCount : "`N/A`"
            }\n\•\u2000\**Start Date:** ${
              manga.startDate
            }\n\•\u2000\**End Date:** ${
              manga.endDate ? manga.endDate : "Ongoing"
            }`,
            true
          )
          .setImage(manga.posterImage.original);
        arr.push(embed);
      });
      // const embeds = new Paginate(arr, message, {
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
        arr,
        "Page"
      ).paginate();
    });
  }
}

export default MangaInfoCommand;
