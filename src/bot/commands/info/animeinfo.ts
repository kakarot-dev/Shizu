/* eslint-disable no-useless-escape */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import aq from "../../struct/aniquote";
// import Paginate from "discordjs-paginate";
import { Pagination } from "../../api/Pagination";

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

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[]): Promise<void> {
    const search = args.join(" ");
    if (!search) {
      await this.client.kitsu.searchAnime(aq()).then(async (result) => {
        const anime = result[0];
        // tslint:disable-next-line: prefer-const
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
            }\n\•\u2000\**Start Date:** ${
              anime.startDate
            }\n\•\u2000\**End Date:** ${
              anime.endDate ? anime.endDate : "Still airing"
            }`,
            true
          )
          .addField(
            "❯\u2000Youtube",
            `•\u2000\[**Click Me**](https://youtube.com/watch?v=${anime.youtubeVideoId})`
          )
          .setImage(anime.posterImage.original);
        return message.channel.send({
          content: `\📺 | Try watching **${anime.titles.english}**!`,
          embeds: [embed],
        });
      });
    } else {
      // tslint:disable-next-line: prefer-const
      const search = args.join(" ");

      const res = await this.client.kitsu.searchAnime(search);
      if (res.length === 0) {
         await message.channel.send(
          `No search results found for **${search}**!`
        );
          return
      }
      // tslint:disable-next-line: prefer-const
      const arr: MessageEmbed[] = [];
      await res.forEach(
        async (anime: {
          titles: { english: string; romaji: string };
          slug: string;
          showType: string;
          posterImage: { original: string };
          synopsis: string;
          ageRating: string;
          nsfw: boolean;
          averageRating: string;
          ratingRank: number;
          popularityRank: number;
          episodeCount: number;
          startDate: string;
          endDate: string;
          youtubeVideoId: string;
        }) => {
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
              }\n\•\u2000\**Start Date:** ${
                anime.startDate
              }\n\•\u2000\**End Date:** ${
                anime.endDate ? anime.endDate : "Still airing"
              }`,
              true
            )
            .addField(
              "❯\u2000Youtube",
              `•\u2000\[**Click me**](https://youtube.com/watch?v=${anime.youtubeVideoId})`
            )
            .setImage(anime.posterImage.original);
          // return message.channel.send({
          //     embed
          // });
          arr.push(embed);
        }
      ).then(() => null)

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
    }
  }
}

export default AnimeInfoCommand;
