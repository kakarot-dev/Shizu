/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ColorResolvable,
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageEmbed,
} from "discord.js";
import Interaction from "../../struct/Interaction";
import { Statuspage } from "statuspage.js";

abstract class DiscordStatusInteraction extends Interaction {
  protected constructor() {
    super({
      name: "discord_status",
      description: "status of discord",
      options: [
        {
          type: 3,
          name: "status",
          description: "Choose between voice or overall status",
          required: true,
          choices: [
            {
              name: "voice",
              value: "voice",
            },
            {
              name: "summary",
              value: "summary",
            },
          ],
        },
      ],
    });
  }

  public async exec(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const component = args.getString("status") as string;
    const page = new Statuspage("srhpyqt94yxb");
    const summary = await page.summary();
    let content = "No available data.";
    const voiceComponentIds = summary.components?.find(
      (c) => c.name === "Voice"
    )?.components;
    const notVoiceComponents = summary.components
      ?.filter((c) => !voiceComponentIds?.includes(c.id))
      .sort((x, y) => (x.name > y.name ? 1 : -1));
    const embed = new MessageEmbed()
      .setColor(getStatusColor(summary.status)?.color as ColorResolvable)
      .setFooter(`Discord Status`);
    switch (component) {
      case "voice":
        const voiceComponents = voiceComponentIds
          ?.map((c) => summary.components?.find((a) => a.id === c) || null)
          .filter(Boolean)
          .sort((x, y) => (x?.name! > y?.name! ? 1 : -1));
        content =
          "**Voice Status**\n" +
            voiceComponents
              ?.map(
                (c) =>
                  c &&
                  `> ${getStatusEmoji(c.status)?.emoji} **${
                    c.name
                  }:** ${capitalize(statusToWords(c.status))}`
              )
              .join("\n") || "No data is available\nPlease Report this";
        // console.log(content)
        embed.setDescription(content);
        await interaction.reply({embeds: [embed]});
        break;
      default:
        content =
          `**Status**: ${summary.status.description}\n` +
            notVoiceComponents
              ?.map(
                (c) =>
                  `> ${getStatusEmoji(c.status)?.emoji} **${
                    c.name
                  }**: ${capitalize(statusToWords(c.status))}`
              )
              .join("\n") || "No component data available.";
        embed.setDescription(content);
        await interaction.reply({embeds: [embed]});
    }
  }
}

export default DiscordStatusInteraction;

const emojisandColor = {
  red: {
    color: "ff0000",
    emoji: "🔴",
  },
  orange: {
    color: "FFA500",
    emoji: "🟠",
  },
  yellow: {
    color: "FFFF00",
    emoji: "🟡",
  },
  green: {
    color: "00ff00",
    emoji: "🟢",
  },
  blue: {
    color: "0000ff",
    emoji: "🔵",
  },
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusEmoji(status) {
  switch (status) {
    case "none":
    case "resolved":
    case "operational":
      return emojisandColor.green;

    case "minor":
    case "monitoring":
    case "degraded_performance":
      return emojisandColor.yellow;

    case "major":
    case "partial_outage":
    case "investigating":
      return emojisandColor.orange;

    case "identified":
    case "major_outage":
    case "critical":
      return emojisandColor.red;

    case "postmortem":
      return emojisandColor.blue;
  }
}

function statusToWords(status) {
  switch (status) {
    case "degraded_performance":
      return "degraded performance";

    case "partial_outage":
      return "partial outage";

    case "major_outage":
      return "major outage";

    default:
      return status;
  }
}

function getStatusColor(status) {
  switch (status.indicator) {
    case "none":
    case "resolved":
    case "operational":
      return emojisandColor.green;

    case "minor":
    case "monitoring":
    case "degraded_performance":
      return emojisandColor.yellow;

    case "major":
    case "partial_outage":
    case "investigating":
      return emojisandColor.orange;

    case "identified":
    case "major_outage":
    case "critical":
      return emojisandColor.red;

    case "postmortem":
      return emojisandColor.blue;
  }
}
