/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Command from "../../struct/Command";
import {Message, MessageActionRow, MessageButton} from "discord.js";
import { create, BinFile, Bin } from "sourcebin-wrapper";
import { inspect } from "util";
import { stripIndents } from "common-tags";

abstract class EvalCommand extends Command {
  protected constructor() {
    super({
      name: "eval",
      aliases: ["e"],
      description: "Evals Stuff",
      usage: "<prefix>eval <eval term>",
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
    const text = args.join(" ");
      const start = process.hrtime();
      let output = await eval(text);
      output = await output;
      const difference = process.hrtime(start);
      output = inspect(output, {depth: 2});
      if (output.length > 4000) {
        const link = await create(
            [
              new BinFile({
                name: "Evaled Content",
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
        await message.channel.send({
          content: `**Execution completed in ${difference[0] > 0 ? `${difference[0]}s ` : ""}${
                  difference[1] / 1e6
              }ms**`,
          embeds: [
            {
              description: "Output greater than 4000 chars",
              color: "GREEN"
            }
          ],
          components: [buttons]
        })
        return
      } else {
        return message.channel.send({
          content: stripIndents`
					**Execution completed in ${difference[0] > 0 ? `${difference[0]}s ` : ""}${
            difference[1] / 1e6
          }ms**`,
          embeds: [
            {
              description: stripIndents(`\`\`\`
              ${output}
              \`\`\``)
            }
          ]
        });
      }
  }
}
export default EvalCommand;
