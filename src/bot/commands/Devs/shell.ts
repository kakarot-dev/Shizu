/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Command from "../../struct/Command";
import {Message, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import childProcess from "child_process";
import { stripIndents } from "common-tags";
import {Bin, BinFile, create} from "sourcebin-wrapper";

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
      let output: string;
      const text = args.join(" ");
     const string = childProcess.exec(text, {}, async (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
        if (error) {
          output = stripIndents(`
          Code: ${error.code}
          Message: \n${error.message}
          `)
        } else output = stdout
          if (output.length > 4000) {
              const link = await create(
                  [
                      new BinFile({
                          name: "Shelled Content",
                          content: output,
                          languageId: "js",
                      }),
                  ],
                  {
                      title: "Content",
                      description: "This is awesome",
                  }
              ) as Bin
              const buttons = new MessageActionRow().addComponents([
                  new MessageButton()
                      .setURL(`https://sourceb.in/${link.key}`)
                      .setStyle('LINK')
                      .setLabel('Link')
              ])
              return message.channel.send({
                  embeds: [
                      {
                          description: "Output greater than 4000 chars",
                          color: "GREEN"
                      }
                  ],
                  components: [buttons]
              })
          }
          embed
              .setColor(error ? "RED" : "GREEN")
              .setDescription(
                  stripIndents(
                      `\`\`\`bash
        ${output}
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
          return message.channel.send({
            embeds: [embed],
          });

        });
        return string
  }
}
export default ShellCommand;
