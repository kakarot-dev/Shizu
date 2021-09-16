/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from "../../struct/Command";
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { watchList } from "../../mongoose/schemas/GuildWatchList";
import t from "../../struct/text";

const watch = t(`${process.cwd()}/assets/Watch.graphql`, require);

abstract class UnWatchCommand extends Command {
  protected constructor() {
    super({
      name: "unwatch",
      aliases: [],
      description: "Removes the anime for anischedule",
      usage:
        "<prefix>unwatch <'Anilist/Mal link | releasing | not-yet-released | all'>",
      category: "mods",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, links: string[], prefix: string) {
    let document = await watchList.findById(String(message.guild?.id));
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setLabel(`Report this here`)
        .setStyle("LINK")
        .setURL(`https://discord.gg/b7HzMtSYtX`),
    ]);
    if (document instanceof Error)
      return message.channel.send({
        content: `A error has occurred! Pls report this to the devs`,
        components: [row],
      });
    if (!document)
      return message.reply({
        content: `Please setup the system by using \`${prefix}anisched <channel>\``,
      });
    if (links[0].toLowerCase() === "all") {
      document.data = [];
      document = await document.save().catch((e) => e);
      if (document instanceof Error) {
        return message.channel.send({
          content: `A error has occurred! Pls report this to the devs`,
          components: [row],
        });
      }
      return message.reply({
        content: "Successfully removed all subscriptions!",
      });
    }
    const options: any[] = [];
    let fetchedIDs: any[] = [],
      fetchedEntries: any[] = [],
      isStatusQuery = false;
    const id = links
      .map((link) => link.match(/(?<=anilist\.co\/anime\/)\d{1,}/gi)?.[0])
      .filter(Boolean);
    const idMal = links
      .map((link) => link.match(/(?<=myanimelist\.net\/anime\/)\d{1,}/gi)?.[0])
      .filter(Boolean);

    if (["releasing", "not-yet-released"].includes(links[0].toLowerCase())) {
      isStatusQuery = true;
      options.push({
        page: 1,
        id: document.data,
        status: links[0].replace(/-/g, "_").toUpperCase(),
      });
    } else {
      for (const [key, ids] of Object.entries({ id, idMal })) {
        if (!ids.length) continue;
        options.push({
          page: 1,
          [key]: ids,
        });
      }
    }
    if (!options.length) {
      return message.reply({
        content: `**${message.author.tag}**, Please provide a valid anime link [MyAnimeList or Anilist] or add \`releasing\`, \`not-yet-released\`, or \`all\` as a parameter to remove all releasing, not yet released, or all anime from your subscriptions.`,
      });
    }
    for (const option of options) {
      let hasNextPage;
      do {
        const { errors, data } = await this.client.anischedule.fetch(
          watch,
          option
        );
        if (errors) {
          // parameters.assign({ '%QUERY%': 'Watch', '%SERVICE%': 'AniList', '%ERROR%': res.errors[0].message });
          // return message.reply(language.get({ '$in': 'ERRORS', id: res.errors[0].status, parameters }));
          return message.reply({
            content: `**${message.author.tag}**, The service Anilist gave the error as ${errors[0].status} with the message ${errors[0].message}`,
          });
        }
        fetchedEntries = [...fetchedEntries, ...data.Page.media];
        fetchedIDs = [
          ...new Set([
            ...fetchedIDs,
            ...data.Page.media.map((media) => media.id),
          ]),
        ];
        hasNextPage = data.Page.pageInfo.hasNextPage;
        option.page = data.Page.pageInfo.currentPage + 1;
      } while (hasNextPage);
    }
    if (!fetchedIDs.length) {
      const MEDIASTATUS = links[0].replace(/-/g, "_").toUpperCase();
      const id = isStatusQuery ? "UNWATCH_SARMVD" : "UNWATCH_MPTYRS";
      return message.reply({
        content:
          id === "UNWATCH_SARMVD"
            ? `**${message.author.tag}**, This server has already removed all \`${MEDIASTATUS}\` anime`
            : `**${message.author.tag}**, None of the provided links/ids matches anime from AniList!`,
      });
    }
    const tbd = fetchedIDs.filter((x) => document.data.includes(x));
    //const exc = fetchedIDs.filter(x => !document.data.includes(x));
    document.data = document.data.filter((d) => !tbd.some((t) => t === d));
    document = await document.save().catch((e) => e);
    const DICT = {
      TIPS: "Tips",
      UNWATCH: "unwatch",
    };
    if (fetchedIDs.length === 1) {
      const ENTRY = String(
        `[**${Object.values(fetchedEntries[0].title).filter(Boolean)[0]}**](${
          fetchedEntries[0].siteUrl
        })`
      );
      const EMOJI = "<:tick:868436462021013504>";
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor(`Removing from watchlist`)
            .setColor(fetchedEntries[0].coverImage.color)
            .setThumbnail(fetchedEntries[0].coverImage.large)
            .setDescription(
              String(
                tbd.length
                  ? `${EMOJI} Successfully removed ${ENTRY}`
                  : `Failed to remove ${ENTRY}\nThis anime is not on your watchlist!`
              )
            )
            .setFooter(`${DICT.UNWATCH}`),
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
      const added = tbd.includes(id) ? "\\✔️" : "\\❌";
      return String(
        `${added}\u2000\u2000\`[ ${idfmt} ]\` [**${title}**](${entry.siteUrl})`
      );
    });
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(0xe620a4)
          .setDescription(entries.join("\n"))
          .setThumbnail(
            fetchedEntries.map((x) => x.coverImage.large).filter(Boolean)[0]
          )
          .setTitle(
            `${fetchedIDs.length} anime has successfully been processed.`
          )
          .setFooter(`${DICT.UNWATCH}`),
      ],
    });
  }
}
export default UnWatchCommand;

// function ordinalize(n = 0) {
//     return Number(n) + ['st', 'nd', 'rd'][n / 10 % 10 ^ 1 && n % 10] || Number(n) + 'th';
// }

function truncate(str: any = "", length = 100, end = "...") {
  return (
    String(str).substring(0, length - end.length) +
    (str.length > length ? end : "")
  );
}
