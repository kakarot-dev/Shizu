/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";

abstract class InviteCommand extends Command {
  protected constructor() {
    super({
      name: "invite",
      aliases: [],
      description: "Gives the invite link of the bot",
      usage: "<prefix>invite",
      category: "info",
      cooldown: 2,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, _args: string[], prefix: string) {
    const embed = new MessageEmbed()
      .setColor(message.guild?.me!.displayHexColor as ColorResolvable)
      .setTitle(`${this.client.user?.tag} (${prefix})`)
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({
          dynamic: true,
        }),
        `https://discord.com/users/${this.client.user?.id}`
      )
      .setURL(`https://discord.com/users/${this.client.user?.id}`)
      .addField(
        "Invite me (Voidbots)",
        `[Click](https://voidbots.net/bot/${this.client.user?.id}/invite)`,
        true
      )
      .addField(
        "Vote for me (Voidbots)",
        `[Click](https://voidbots.net/bot/${this.client.user?.id}/vote)`,
        true
      );
    await message.reply({ embeds: [embed] });
  }
}
export default InviteCommand;
