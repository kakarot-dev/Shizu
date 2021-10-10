/* eslint-disable no-useless-escape */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import aq from "../../struct/aniquote";
// import Paginate from "discordjs-paginate";
import { Pagination } from "../../api/Pagination";
import Anime from "../../struct/Kitsu/Anime";

abstract class AnimeInfoCommand extends Command {
  protected constructor() {
    super({
      name: "animeinfo",
      aliases: ["anime", "ani"],
      description: "Search For an anime",
      usage: "<prefix>anime <search term>",
      category: "info",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  public async exec(message: Message, args: string[]): Promise<void> {
    const search = args.join(" ");
    if (!search) {
      const result: Anime[]= await this.client.kitsu.searchAnime(aq().quoteanime)
        const anime: Anime = result[0];
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setFooter(
                `Requested By ${message.author.tag}`,
                message.author.displayAvatarURL({
                    dynamic: true,
                })
            )
            .setTitle(`${anime.titles.english}`)
            .setURL(`https://kitsu.io/anime/${anime.slug}`)
            .setAuthor(`${anime.showType}`, anime.posterImage.original)
            .setDescription(anime.synopsis.replace(/<[^>]*>/g, "").split("\n")[0])
            .addField(
                "❯\u2000Information",
                `•\u2000\**Japanese Name:** ${
                    anime.titles.romaji
                }\n\\•\u2000\**Age Rating:** ${
                    anime.ageRating
                }\n\\•\u2000\**NSFW:** ${anime.nsfw ? "Yes" : "No"}`
            )
            .addField(
                "❯\u2000Stats",
                `•\u2000\**Average Rating:** ${anime.averageRating}\n\•\u2000\**Rating Rank:** ${anime.ratingRank}\n\•\u2000\**Popularity Rank:** ${anime.popularityRank}`,
                true
            )
            .addField(
                "❯\u2000Status",
                `•\u2000\**Episodes:** ${
                    anime.episodeCount ? anime.episodeCount : "N/A"
                }\n\\•\u2000\**Start Date:** ${
                    anime.startDate
                }\n\\•\u2000\**End Date:** ${
                    anime.endDate ? anime.endDate : "Still airing"
                }`,
                true
            )
            .addField(
                "❯\u2000Youtube",
                `•\u2000\[**Click Me**](https://youtube.com/watch?v=${anime.youtubeVideoId})`
            )
            .setImage(anime.posterImage.original);
        message.channel.send({
            content: `\\📺 | Try watching **${anime.titles.english}**!`,
            embeds: [embed],
        });
        return
    } else {
      const search = args.join(" ");

      const res = await this.client.kitsu.searchAnime(search);
      if (res.length === 0) {
         await message.channel.send(
          `No search results found for **${search}**!`
        );
          return
      }

      const arr: MessageEmbed[] = res.map(
         (anime: Anime) => {
          const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${anime.titles.english ? anime.titles.english : search}`)
            .setURL(`https://kitsu.io/anime/${anime.slug}`)
            .setAuthor(
              `${anime.titles.english ? anime.titles.english : search} | ${
                anime.showType
              }`,
              anime.posterImage.original
            )
            .setDescription(
              anime.synopsis.replace(/<[^>]*>/g, "").split("\n")[0]
            )
            .addField(
              "❯\u2000Information",
              `•\u2000\**Japanese Name:** ${
                anime.titles.romaji
              }\n\•\u2000\**Age Rating:** ${
                anime.ageRating
              }\n\•\u2000\**NSFW:** ${anime.nsfw ? "Yes" : "No"}`
            )
            .addField(
              "❯\u2000Stats",
              `•\u2000\**Average Rating:** ${anime.averageRating}\n\•\u2000\**Rating Rank:** ${anime.ratingRank}\n\•\u2000\**Popularity Rank:** ${anime.popularityRank}`,
              true
            )
            .addField(
              "❯\u2000Status",
              `•\u2000\**Episodes:** ${
                anime.episodeCount ? anime.episodeCount : "N/A"
              }\n\\•\u2000\**Start Date:** ${
                anime.startDate
              }\n\\•\u2000\**End Date:** ${
                anime.endDate ? anime.endDate : "Still airing"
              }`,
              true
            )
            .addField(
              "❯\u2000Youtube",
              `•\u2000\[**Click me**](https://youtube.com/watch?v=${anime.youtubeVideoId})`
            )
            .setImage(anime.posterImage.original);
          return embed
        }
      )
      await new Pagination(
        message,
        message.channel as TextChannel,
        arr,
        "Page"
      ).paginate();
    }
  }
}

export default AnimeInfoCommand;
