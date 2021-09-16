/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import html2md from "html2markdown";
import { decode } from "he";
import axios from "axios";

abstract class SteamCommand extends Command {
  protected constructor() {
    super({
      name: "steam",
      aliases: ["steamstore"],
      description: "Search For an game from steam",
      usage: "<prefix>steam <search term>",
      category: "info",
      cooldown: 60,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: string[]) {
    const query = args.join(" ") || "Doki Doki Literature Club";

    const res = await axios
      .get(
        `https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURI(
          query
        )}`
      )
      .then((res) => res.data)
      .catch(() => null);

    if (!res || !res.total) {
      return message.channel.send(
        `\\❌ Could not find **${query}** on <:stream:845570572054036500> steam`
      );
    }

    const body = await axios
      .get(
        `https://store.steampowered.com/api/appdetails/?cc=us&l=en&appids=${res.items[0].id}`
      )
      .then((res) => res.data)
      .catch(() => null);

    if (!body) {
      return message.channel.send(
        `\\❌ Could not find **${query}** on <:stream:845570572054036500> steam`
      );
    }

    const data = body[res.items[0].id].data;
    const platformLogo = {
      windows: "<:windows:845581565937319956>",
      mac: "<:ios:845583332347215902>",
      linux: "<:linux:845581879142514698>",
    };
    const platformrequirements = {
      windows: "pc_requirements",
      mac: "mac_requirements",
      linux: "linux_requirements",
    };
    const current = (data.price_overview?.final || "Free").toLocaleString(
      "en-US",
      { style: "currency", currency: "USD" }
    );
    const original = (data.price_overview?.initial || "Free").toLocaleString(
      "en-US",
      { style: "currency", currency: "USD" }
    );
    const price =
      current === original ? current : `~~~${original}~~~ ${current}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const platforms = Object.entries(data.platforms)
      .filter(([, has]) => has)
      .map(([platform]) => {
        return {
          name: "\u200b",
          inline: true,
          value: `${platformLogo[platform]} ${
            decode(html2md(data[platformrequirements[platform]].minimum)).split(
              "* **Additional Notes:"
            )[0]
          }`,
        };
      });
    platforms[0].name = "System Requirements";

    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(0x101d2f)
          .setTitle(data.name)
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/836253852855697418/845579957609562112/767062357952167946.png"
          )
          .setImage(res.items[0].tiny_image)
          .setURL(`https://store.steampowered.com/app/${data.steam_appid}`)
          .setFooter("Steam @ Steam.Inc©️")
          .addFields([
            { name: "Price", value: `•\u2000 ${price}`, inline: true },
            {
              name: "Metascore",
              value: `•\u2000 ${data.metacritic?.score || "???"}`,
              inline: true,
            },
            {
              name: "Release Date",
              value: `•\u2000 ${data.release_date?.data || "???"}`,
              inline: true,
            },
            {
              name: "Developers",
              value: data.developers.map((m) => `• ${m}`).join("\n"),
              inline: true,
            },
            {
              name: "Categories",
              value: data.categories
                .map((m) => `• ${m.description}`)
                .join("\n"),
              inline: true,
            },
            {
              name: "Genres",
              value: data.genres.map((m) => `• ${m.description}`).join("\n"),
              inline: true,
            },
            {
              name: "\u200b",
              value: truncate(
                decode(data.detailed_description.replace(/(<([^>]+)>)/gi, " ")),
                1000
              ),
            },
            {
              name: "Supported Languages",
              value: `\u2000${truncate(
                html2md(data.supported_languages),
                1000
              )}`,
            },
            ...platforms,
          ]),
      ],
    });
  }
}

export default SteamCommand;

/**
 * TextTruncate -> Shortens the string to desired length
 * @param {string} str the string to test with
 * @param {number} length the length the string should have
 * @param {string} end the end of the string indicating it's truncated
 * @returns {string} Truncated string
 */
function textTruncate(str = "", length = 100, end = "...") {
  return (
    String(str).substring(0, length - end.length) +
    (str.length > length ? end : "")
  );
}

// extends textTruncate function -> lesser length
function truncate(...options) {
  return textTruncate(...options);
}
