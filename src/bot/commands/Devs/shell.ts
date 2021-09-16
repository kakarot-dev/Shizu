/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import childProcess from "child_process";
import { stripIndents } from "common-tags";

abstract class ShellCommand extends Command {
  protected constructor() {
    super({
      name: "shell",
      aliases: ["sh"],
      description: "shell Stuff",
      usage: "<prefix>shell <eval term>",
      category: "Devs",
      cooldown: 2,
      ownerOnly: true,
      guildOnly: false,
      requiredArgs: 1,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: string[]) {
    const embed = new MessageEmbed();
    const text = args.join(" ");
    childProcess.exec(text, {}, (error, stdout, stderr) => {
      console.log(error, stdout, stderr);
      if (error) {
        embed.setColor("RED").setDescription(
          stripIndents(`\`\`\`bash
            ${error.message}\n${stdout}
            \`\`\``)
        );
        message.channel.send({
          embeds: [embed],
        });
        return;
      } else {
        embed
          .setColor("GREEN")
          .setDescription(
            stripIndents(
              `\`\`\`bash
        ${stdout}
        \`\`\``
            )
          )
          .addField(
            "stderror",
            stripIndents(
              `\`\`\`
          ${stderr ? stderr : "No errors"}
          \`\`\``
            )
          );
        message.channel.send({
          embeds: [embed],
        });
        return;
      }
    });
  }
}
export default ShellCommand;
