import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import t from "../../struct/text";
import moment from "moment";

const existsqury = t(`${process.cwd()}/assets/AirDateQuery.graphql`, require);

const responses = {
  NOT: (n) => {
    return `${n.anime} has **not been released** yet. It is expected to premiere on ${n.date} (${n.fromnow})`;
  },
  REL: (n) => {
    return `Episode **${n.episode}${n.finale}** of ${n.anime} will air approximately ${n.time}`;
  },
  HIA: (n) => {
    return `${n.anime} is currently on **hiatus**.`;
  },
  CAN: (n) => {
    return `${n.anime} was **cancelled**`;
  },
  FIN: (n) => {
    return `${n.anime} has already **finished airing** last ${n.date} (${n.fromnow}).`;
  },
  DES: (n) => {
    return `Episode **${n.episode}** airs in ${n.time}`;
  },
  NON: (n) => {
    return `Next airdate for ${n.anime} is still **unknown**`;
  },
};

abstract class nextEpCommand extends Command {
  protected constructor() {
    super({
      name: "nextep",
      aliases: ["nextepisode"],
      description: "Set a channel for discord Status",
      usage: "<prefix> [name of the anime]",
      category: "misc",
      cachedData: false,
      cooldown: 10,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async exec(message: Message, args: string[]) {
    let query;
    let search;
    switch (args[0]) {
      case undefined:
        return message.channel.send(
          "Please provide a parameter to search for."
        );
      default:
        query = existsqury;
        search = { search: args.join(" ") };
    }
    const { errors, data } = await this.client.anischedule.fetch(query, search);
    if (errors) {
      await message.reply({
        content: `The service Anilist gave a ${errors[0].status} status.\nThe message recieved => ${errors[0].message}`,
      });
      return;
    }
    const media = [data.Media || data.Page.media].flat();
    const footer = "Recieved data through anilist";
    if (search) {
      if (
        media[0].isAdult && !(message.channel as TextChannel).nsfw &&
        message.channel.type !== "DM"
      ) {
        // return message.reply(language.get({ '$in': 'COMMANDS', id: 'NEXTAIRDATE_H', parameters }));
        await message.reply({
          content:
            "The anime you are looking for is nfsw. Please use this command in a nsfw channel",
        });
        return;
      }
      const altTitles = Object.values(media[0].title)
        .filter(Boolean)
        .slice(1)
        .join("\n");
      const dt = Math.round(
        new Date().setSeconds(media[0].nextAiringEpisode?.timeUntilAiring) /
          1000
      );
      const seasonFinale =
        media[0].episodes &&
        media[0].episodes === media[0].nextAiringEpisode?.episode
          ? ` final`
          : "";
      const timeUntilAiring = `<t:${dt}:R> ( <t:${dt}:F> )`;
      const anime = `[${media[0].title.english || media[0].title.romaji}](${
        media[0].siteUrl
      })`;
      const studios = `${media[0].id}\u2000|\u2000${
        media[0].studios.edges
          .map((x) => `[${x.node.name}](${x.node.siteUrl})`)
          .join("\u2000|\u2000") || "~"
      }`;
      const date = media[0].startDate.year
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          moment(new Date(...Object.values(media[0].startDate))).format(
            `${media[0].startDate.day ? "Do " : ""}${
              media[0].startDate.month ? "MMMM " : ""
            }YYYY`
          )
        : "unknown";
      const fromNow = media[0].startDate.year
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          moment(new Date(...Object.values(media[0].startDate))).fromNow()
        : "unknown";
      const parameters = {
        time: timeUntilAiring,
        episode: media[0].nextAiringEpisode.episode,
        fromnow: fromNow,
        finale: seasonFinale,
        date: date,
        anime: anime,
      };
      const description = media[0].episodes
        ? responses[`${media[0].status.slice(0, 3)}`](parameters)
        : responses.NON(parameters);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(media[0].coverImage.color)
            .setThumbnail(media[0].coverImage.large)
            .setTitle(String(Object.values(media[0].title).filter(Boolean)[0]))
            .setDescription(altTitles + "\n\n" + description + "\n\n" + studios)
            .setFooter(`${footer}`),
        ],
      });
    }
  }
}
export default nextEpCommand;
