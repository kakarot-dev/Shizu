/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import Button from "../../../struct/Button";

const row = new MessageActionRow().addComponents([
  new MessageButton()
    .setCustomId("help_utility")
    .setLabel("Util")
    .setStyle("SECONDARY")
    .setEmoji("🛠️"),
  new MessageButton()
    .setCustomId("help_mod")
    .setEmoji("🛡️")
    .setLabel("Mods")
    .setStyle("DANGER")
    .setDisabled(true),
  new MessageButton()
    .setCustomId("help_Action")
    .setEmoji("<:GawrGuraHug:864094967055908864>")
    .setLabel("Action")
    .setStyle("SUCCESS"),
  new MessageButton()
    .setCustomId("help_misc")
    .setEmoji("🏅")
    .setLabel("Misc")
    .setStyle("SECONDARY"),
  new MessageButton()
    .setCustomId("help_Info")
    .setEmoji("<:infoshizu:864104487264976906>")
    .setStyle("SECONDARY")
    .setLabel("Info"),
]);

abstract class ModsInteraction extends Button {
  constructor() {
    super({
      name: "help_mod",
    });
  }

  public async exec(interaction: ButtonInteraction) {
    const embed = new MessageEmbed();
    if (interaction.channel?.type !== "DM") {
      embed.setFooter(
        `Note: Anyone can click on the buttons and use them. This feature completely Intentional. Dm sh.help to have full control`
      );
    }
    embed
      .setColor("RANDOM")
      .setTitle(`${this.client.user?.username}\\'s Help Menu`)
      .setAuthor(
        interaction.user.tag,
        interaction.user.displayAvatarURL({ dynamic: true }),
        "https://discord.gg/b7HzMtSYtX"
      );
    const commandNames: Array<string> = [];
    const commands = this.client.commands.filter((c) => c.category === "mods");
    for (const command of commands) {
      if (!commandNames.includes(command[1].name)) {
        commandNames.push(command[1].name);
      }
    }
    embed.addField("Mods", commandNames.map((c) => `\`${c}\``).join(", "));

    interaction.update({
      embeds: [embed],
      components: [row],
    });
    return;
  }
}

export default ModsInteraction;
