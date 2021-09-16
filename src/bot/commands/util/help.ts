/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { stripIndents } from "common-tags";

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
    .setStyle("DANGER"),
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
abstract class HelpCommand extends Command {
  protected constructor() {
    super({
      name: "help",
      aliases: ["h", "heellllppp"],
      description: "Display a list of all my commands!",
      category: "util",
    });
  }

  public async exec(message: Message, args: string[], prefix: string) {
    const command = this.client.commands.get(args[0]);
    const embed = new MessageEmbed();
    if (message.channel.type !== "DM") {
      embed.setFooter(
        `Note: Anyone can click on the buttons and use them. This feature completely Intentional. Dm sh.help to have full control`
      );
    }
    // const categories = this.removeDuplicates(
    //   this.client.commands.filter((c) => !c.ownerOnly).map((c) => c.category)
    // );
    if (command) {
      embed
        .setColor("RANDOM")
        .setTitle(`${this.client.user?.username}\\'s Help Menu`)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true }),
          "https://discord.gg/b7HzMtSYtX"
        )
        .setDescription(
          stripIndents(`
    			**Name:** ${command.name}
    			**Usage:** ${(command.usage ? command.usage : "None").replace("<prefix>", prefix)}
    			**Aliases:** ${
            command.aliases?.length ? command.aliases.join(", ") : "None"
          }
    			**Description:** ${command.description}
    		  `)
        );
      return message.channel.send({
        embeds: [embed],
        components: [row],
      });
    } else {
      embed
        .setColor("RANDOM")
        .setTitle(`${this.client.user?.username}\\'s Help Menu`)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true }),
          "https://discord.gg/b7HzMtSYtX"
        )
        .setDescription(
          stripIndents(`\`\`\`
		Prefix: ${prefix}\n
		Click on the buttons below to check out the commands in each category.
		\`\`\``)
        );
      //   for (const category of categories) {
      //
      //     const commandNames: Array<string> = [];
      //     const commands = this.client.commands.filter(
      //       (c) => c.category === category
      //     );
      //     for (const command of commands) {
      //       if (!commandNames.includes(command[1].name)) {
      //         commandNames.push(command[1].name);
      //       }
      //     }
      //     embed.addField(
      //       category ?? "Any",
      //       commandNames.map((c) => `\`${c}\``).join(", ")
      //     );
      //   }
      message.channel.send({
        embeds: [embed],
        components: [row],
      });
    }
  }

  public removeDuplicates(array: Array<string | undefined>) {
    return [...new Set(array)];
  }
}

export default HelpCommand;
