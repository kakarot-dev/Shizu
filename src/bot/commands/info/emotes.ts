import _ from "lodash";
import Command from "../../struct/Command";
import {Guild, GuildMember, Message, MessageEmbed} from "discord.js";

abstract class EmotesCommand extends Command {
  protected constructor() {
    super({
      name: "emotes",
      aliases: ["emojis"],
      description: "Shows the emoji\\'s of this server",
      usage: "<prefix>emojis",
      category: "info",
      cooldown: 2,
      ownerOnly: false,
      guildOnly: true,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, _args: string[]) {
    const guild = message.guild as Guild;
    const member = message.member as GuildMember;
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
              value: "" + x.map((x) => `\u2000 ${x}`).join(" "),
            };
          })
        );
      await message.reply({ embeds: [embed] });
  }
}
export default EmotesCommand;

