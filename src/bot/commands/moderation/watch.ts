/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from "../../struct/Command";
import {
  Message,
  MessageEmbed,
} from "discord.js";
import t from "../../struct/text";
import { duration } from "moment";

const watch = t(`${process.cwd()}/assets/Watch.graphql`, require);

abstract class WatchCommand extends Command {
  protected constructor() {
    super({
      name: "watch",
      aliases: [],
      description: "Set the anime for anischedule",
      usage:
        "<prefix>watch <'Anilist/Mal link | releasing | not-yet-released'>",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, links: string[], prefix: string) {
    const document = await this.client.prisma.guildWatchList.findFirst({
      where: {
        id: BigInt(message.guild?.id as string)
      },
      select: {
        id: true,
        data: true
      }
    })
    if (!document)
      return message.reply({
        content: `Please setup the system by using \`${prefix}anisched <channel>\``,
      });
    const id = links
      .map((link) => link.match(/(?<=anilist\.co\/anime\/)\d{1,}/gi)?.[0])
      .filter(Boolean);
    const idMal = links
      .map((link) => link.match(/(?<=myanimelist\.net\/anime\/)\d{1,}/gi)?.[0])
      .filter(Boolean);
    interface objop {
      page?: number;
      id_not_in?: number[];
      status?: string | number | undefined;
      seasonYear?: string | number | Date;
      isAdult?: boolean;
      status_in?: string[];
    }
    let fetchedIDs: string[] = [],
      fetchedEntries: any[] = [];
    let isStatusQuery = false;
    const options: objop[] = [];

    if (["releasing", "not-yet-released"].includes(links[0].toLowerCase())) {
      isStatusQuery = true;
      options.push({
        page: 1,
        id_not_in: document.data.map<number>((big: BigInt) => Number(big)),
        status /*Query anime with status RELEASING or NOT_YET_RELEASED*/:
          links[0].replace(/-/g, "_").toUpperCase(),
        seasonYear /*Do not query anime which was not released during this year*/:
          new Date().getFullYear(),
        isAdult /*Filter out adult entries*/: false,
      });
    }
    // Executed whenever the user uses hentai as parameter
    else if (links[0].toLowerCase() === "hentai") {
      isStatusQuery = true;
      options.push({
        page: 1,
        id_not_in: document.data.map<number>((big: BigInt) => Number(big)),
        status: "RELEASING",
        isAdult: true,
      });
    } else {
      for (const [key, ids] of Object.entries({ id, idMal })) {
        if (!ids.length) continue;
        options.push({
          page: 1,
          [key]: ids,
          status_in: ["RELEASING", "NOT_YET_RELEASED"],
        });
      }
    }
    if (!options.length) {
      return message.reply({
        content: `**${message.author.tag}**, Please provide a valid anime link [MyAnimeList or Anilist] or add \`releasing\` or \`not-yet-released\` as a parameter to add all releasing or not yet released anime to your subscriptions.`,
      });
    }
    for (const option of options) {
      let hasNextPage;
      // Always execute once, before checking the hasNextPage variable.
      do {
        // Extract errors or data from the Anilist API
        const { errors, data } = await this.client.anischedule.fetch(
          watch,
          option
        );
        // If any error occurs while fetching the API. Cancel all operation.
        if (errors) {
         throw {
           message: "Error happening while fetching data from anilist. The operation logs will be logged through a different route."
         }
        }
        // add the fetched entry from this current cycle to all of the fetched entries
        fetchedEntries = [...fetchedEntries, ...data.Page.media];
        // add the fetched id from each entry from this current cycle while preventing duplicates
        fetchedIDs = [
          ...new Set([
            ...fetchedIDs,
            ...data.Page.media.map((media) => media.id),
          ]),
        ];
        // modify the hasNextPage variable. If true, this loop will cycle again, using different parameters for current page
        hasNextPage = data.Page.pageInfo.hasNextPage;
        // Modify the value of the option's currentPage to the next page in case the hasNextPage variable is true
        option.page = data.Page.pageInfo.currentPage + 1;
      } while (hasNextPage);
    }
    if (!fetchedIDs.length) {
      // Empty response from Anilist. Meaning if you provided links, none of the links match an anime
      // If you used the [status] query, all [status] anime has already been added.
      const MEDIASTATUS = links[0].replace(/-/g, "_").toUpperCase();
      const id = isStatusQuery ? "WATCH_SALLADDED" : "WATCH_EMPTYRES";
      return message.reply({
        content:
          id === "WATCH_SALLADDED"
            ? `**${message.author.tag}**, This server has already added all \`${MEDIASTATUS}\` anime`
            : `**${message.author.tag}**, None of the provided links/ids matches anime from AniList!`,
      });
    }

    const idsToBeAdded = fetchedIDs.filter(
      (id) => document.data.indexOf(BigInt(id)) < 0
    );
    const idsAlreadyAdded = fetchedIDs.filter(
      (id) => document.data.indexOf(BigInt(id)) >= 0
    );

    // Add all new IDs to the document
    document.data = [
      ...new Set([
        ...document.data,
        ...fetchedEntries
          .filter((x) => ["RELEASING", "NOT_YET_RELEASED"].includes(x.status))
          .map((x) => x.id),
      ]),
    ];

    // Save the document and catch the error, if there is any
    await this.client.prisma.guildWatchList.update({
      where: {
        id: BigInt(message.guild?.id as string)
      },
      data: {
        data: document.data
      }
    })

    const DICT = {
      TIPS: "Tips",
      WATCH: "watch",
      "DAY(S)": "day(s)",
      "HOUR(S)": "hour(s)",
      "MINUTE(S)": "minute(s)",
    };
    if (fetchedIDs.length === 1) {
      const ENTRY_TITLE = `[**${
        Object.values(fetchedEntries[0].title).filter(Boolean)[0]
      }**](${fetchedEntries[0].siteUrl})`;
      const TIMEUNTILAIR = duration(
        fetchedEntries[0].nextAiringEpisode?.timeUntilAiring,
        "seconds"
      ).format(
        `d [${DICT["DAY(S)"]}] h [${DICT["HOUR(S)"]}] m [${DICT["MINUTE(S)"]}]`
      );
      const EPISODENUM = this.ordinalize(
        fetchedEntries[0].nextAiringEpisode?.episode
      );
      const EMOJI = "<:tick:868436462021013504>";

      let description = "";
      if (
        ["FINISHED", "CANCELLED", "HIATUS"].includes(fetchedEntries[0].status)
      ) {
        description += `Failed to add ${ENTRY_TITLE}.` + "\n";
        if (fetchedEntries[0].status === "FINISHED")
          description += "This anime has already finished airing!";
        else if (fetchedEntries[0].status === "CANCELLED")
          description += "This anime has been cancelled!";
        else description += "This anime is currently on hiatus!";
        // description += language.get({ '$in': 'COMMANDS', id: `WATCH_${fetchedEntries[0].status}`, parameters });
      } else {
        if (idsAlreadyAdded.length) {
          description += `Failed to add ${ENTRY_TITLE}` + "\n";
          description += `This anime is already on your watchlist!` + "\n";
        } else {
          description += `${EMOJI} Successfully added ${ENTRY_TITLE}` + "\n";
        }
        if (fetchedEntries[0].nextAiringEpisode?.timeUntilAiring) {
          description += `Its **${EPISODENUM}** episode is expected to air in **${TIMEUNTILAIR}**`;
        } else {
          description += "Its **next** episode airdate is still unknown!";
        }
      }
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(description)
            .setThumbnail(fetchedEntries[0].coverImage.large)
            .setColor(fetchedEntries[0].coverImage.color || 0xe620a4)
            .setAuthor("Adding to watchlist")
            .setFooter(`${DICT.WATCH}`),
        ],
      });
    }

    const entries = fetchedIDs.slice(0, 20).map((id) => {
      const entry = fetchedEntries.find((x) => x.id === id);
      const title = truncate(
        Object.values(entry.title).filter(Boolean)[0],
        40,
        "..."
      );
      const idfmt =
        String.fromCharCode(32).repeat(6 - id.toString().length) +
        id.toString();
      const added = idsAlreadyAdded.includes(id)
        ? "\\⚠️"
        : idsToBeAdded.includes(id) &&
          ["RELEASING", "NOT_YET_RELEASED"].includes(entry.status)
        ? "\\✔️"
        : "\\❌";
      return String(
        `${added}\u2000\u2000\`[ ${idfmt} ]\` [**${title}**](${entry.siteUrl})`
      );
    });

    let msg = "";

    const COUNT = fetchedIDs.length;
    if (fetchedEntries.some((entry) => entry.isAdult)) {
      msg = "Some of your entries contain an adult material!";
    }
    return message.channel.send({
      content: msg + " ",
      embeds: [
        new MessageEmbed()
          .setColor(0xe620a4)
          .setDescription(entries.join("\n"))
          .setThumbnail(
            fetchedEntries.map((x) => x.coverImage.large).filter(Boolean)[0]
          )
          .setTitle(`${COUNT} anime has successfully been processed.`)
          .setFooter(`${DICT.WATCH}`),
      ],
    });
  }
  ordinalize(n = 0) {
    return (
        Number(n) + ["st", "nd", "rd"][(n / 10) % 10 ^ 1 && n % 10] ||
        Number(n) + "th"
    );
  }

}
export default WatchCommand;

function truncate(str: any = "", length = 100, end = "...") {
  return (
      String(str).substring(0, length - end.length) +
      (str.length > length ? end : "")
  );
}