/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import Interaction from "../../struct/Interaction";
import _ from "lodash";

abstract class EmotesInteraction extends Interaction {
  constructor() {
    super({
      name: "emotes",
      description: "The guild's Emotes",
      cooldown: 10,
    });
  }

  public async exec(interaction: CommandInteraction) {
    const { guild } = interaction;
    if (guild) {
      const member = interaction.member as GuildMember;
      const embed = new MessageEmbed()
        .setColor(member.displayColor || "GREY")
        .setAuthor(`${guild.name} Emoji List`)
        .addFields(
          _.chunk(
            [...guild.emojis.cache.values()]
              .filter((x) => x.id !== guild.id)
              .sort((A, B) => B.createdTimestamp - A.createdTimestamp),
            12
          ).map((x) => {
            return {
              name: "\u200b",
              inline: true,
              // tslint:disable-next-line: prefer-template
              value: "" + x.map((x) => `\u2000 ${x}`).join(" "),
            };
          })
        );
      interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply({
        content: "A error occurred! Make sure this is a guild",
      });
    }
  }
}

export default EmotesInteraction;
