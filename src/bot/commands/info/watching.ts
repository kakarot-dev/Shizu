/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Permissions,
  TextChannel,
} from "discord.js";
import { watchList } from "../../mongoose/schemas/GuildWatchList";
import t from "../../struct/text";
import * as _ from "lodash";
import { Pagination } from "../../api/Pagination";

const watch = t(`${process.cwd()}/assets/Watching.graphql`, require);

abstract class WatchingCommand extends Command {
  protected constructor() {
    super({
      name: "watching",
      aliases: [],
      description: "The anime which is followed by the guild\nCommand bugged",
      usage: "<prefix>watching",
      category: "info",
      cooldown: 20,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, _links: string[], prefix: string) {
    const listings = await watchList.findById(String(message.guild?.id));
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setLabel(`Report this here`)
        .setStyle("LINK")
        .setURL(`https://discord.gg/b7HzMtSYtX`),
    ]);
    if (listings instanceof Error)
      return message.channel.send({
        content: `A error has occurred! Pls report this to the devs`,
        components: [row],
      });
    if (listings === null || !listings.data.length)
      return message.reply({
        content: `Please setup the system by using \`${prefix}anisched <channel>\``,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: any[] = [];
    // if (Number(listings.data.length) > 20) {
    //     await message.channel.send(`Ur Guild Watches too much Animes lmao, Hence to save ratelimits We have decided to slice it to 20 results from ${listings.data.length}`)
    //     listings.data = listings.data.slice(0, 20)
    // }
    // console.log(listings.data.length + ' ' +  typeof listings.data)
    let hasNextPage,
      page = 0;
    do {
      const res = await this.client.anischedule.fetch(watch, {
        watched: listings.data,
        page,
      });
      if (res.errors) {
        return message.reply({
          content: `**${message.author.tag}**, The service Anilist gave the error as ${res.errors[0].status} with the message ${res.errors[0].message}`,
        });
      }
      if (!entries.length && !res.data.Page.media.length) {
        return message.reply({
          content: `**${message.author.tag}**, , There is no data in the database or the anime's finished airing`,
        });
      }
      page = res.data.Page.pageInfo.currentPage + 1;
      hasNextPage = res.data.Page.pageInfo.hasNextPage;
      entries.push(
        ...res.data.Page.media.filter((x) => x.status === "RELEASING")
      );
    } while (hasNextPage);
    const ENTRYCOUNT = entries.length;
    const hyperlinkify = (id, title, url) =>
      `•\u2000\u2000\`[ ${id} ]\` [**${title}**](${url})`;
    const formatID = (entry) =>
      " ".repeat(6 - String(entry.id).length) + String(entry.id);
    const _mapFn = (entry) =>
      hyperlinkify(
        formatID(entry),
        truncate(entry.title.romaji, 42, "..."),
        entry.siteUrl
      );
    const chunks = entries.sort((A, B) => A.id - B.id).map(_mapFn);
    const footer = "Anischedule";
    const descriptions = _.chunk(chunks, 20).map((d) => {
      return new MessageEmbed()
        .setDescription(d.join("\n"))
        .setTitle(`Current Anischedule Subscription (${ENTRYCOUNT} Entries)`)
        .setColor(0xe620a4)
        .setFooter(`${footer}`)
        .addField(
          `Tips`,
          `- Use [\`${prefix}watch\`](%WATCHURL%) to add subscription.\n- Use [\`${prefix}unwatch\`](%UNWATCHURL%) to remove subscription.\n- Use \`${prefix}nextep <anime title>\` to check episode countdown.`
        );
    });
    if (descriptions.length === 1) {
      return message.channel.send({
        embeds: [descriptions[0]],
      });
    }
    const channel = message.guild?.channels.cache.get(listings.channelId);
    if (
      !channel ||
      !channel
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        .permissionsFor(message.guild?.me!)
        .has([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS])
    ) {
      if (!channel) {
        await message.channel.send({
          content: `\\❌ This server's anischedule feature has been disabled.`,
        });
      } else {
        await message.channel.send({
          content: `\\⚠️ I may not be able to send messages on ${listings.channelId} because of missing Send Message and/or Embed Links Permission.`,
        });
      }
    }
    // const embeds = new Paginate(descriptions, message, {
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
      descriptions,
      "Page"
    ).paginate();
  }
}
export default WatchingCommand;

// function ordinalize(n = 0) {
//     return Number(n) + ['st', 'nd', 'rd'][n / 10 % 10 ^ 1 && n % 10] || Number(n) + 'th';
// }

function truncate(str = "", length = 100, end = "...") {
  return (
    String(str).substring(0, length - end.length) +
    (str.length > length ? end : "")
  );
}
