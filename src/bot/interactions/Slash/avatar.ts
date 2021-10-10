/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ColorResolvable,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  MessageEmbed,
} from "discord.js";
import Interaction from "../../struct/Interaction";

abstract class AvatarInteraction extends Interaction {
  protected constructor() {
    super({
      name: "avatar",
      description: "Avatar of a user in a server",
      options: [
        {
          type: "USER",
          name: "target",
          description: "Target User to see the avatar",
          required: true,
        },
      ],
    });
  }

  public async exec(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    if (!interaction.guild)
      return interaction.reply("Make Sure this is a Guild");
    // const { guild } = interaction;
    const member = args.getMember("target") as GuildMember;

    const embed = new MessageEmbed()
      .setTitle(`Avatar of ${member.user.tag}.`)
      .setColor(member?.displayHexColor as ColorResolvable)
      .setImage(
        member.user?.displayAvatarURL({
          dynamic: true,
          size: 4096,
        })
      )
      .setFooter(`${member.user?.tag}\'s Avatar`);
    interaction.reply({
      embeds: [embed],
    });
  }
}

export default AvatarInteraction;
