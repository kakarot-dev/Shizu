/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Command from "../../struct/Command";
import { Message } from "discord.js";
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
    try {
      const start = process.hrtime();
      // tslint:disable-next-line: no-eval
      let output = await eval(text);
      output = await output;
      const difference = process.hrtime(start);
      output = inspect(output, {depth: 2});
      if (output.length > 1995) {
        create(
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
        ).then(async (result) => {
          const url = result as Bin;
          return message.channel.send({
            content: stripIndents`
							**Execution completed in ${difference[0] > 0 ? `${difference[0]}s ` : ""}${
              difference[1] / 1e6
            }ms**
						   \`\`\`js
						   https://sourceb.in/${url.key}
						   \`\`\`
						   `,
          });
        });
      } else {
        return message.channel.send({
          content: stripIndents`
					**Execution completed in ${difference[0] > 0 ? `${difference[0]}s ` : ""}${
            difference[1] / 1e6
          }ms**
					\`\`\`js
					${output}
					\`\`\`
					`,
        });
      }
    } catch (err: any) {
      return message.channel.send({
        content: stripIndents`
      	\`\`\`${err.message}\`\`\`
      	`,
      });
    }
  }
}
export default EvalCommand;
