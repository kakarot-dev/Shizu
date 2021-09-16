/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message } from "discord.js";
import axios from "axios";

abstract class ReverseCommand extends Command {
  protected constructor() {
    super({
      name: "reverse",
      aliases: [],
      description: "Reverse text : )",
      usage: "<prefix>reverse <term>",
      category: "misc",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 1,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[]) {
    const text = args.join(" ");
    axios
      .get(
        `https://aria-api.up.railway.app/misc/reverse?content=${encodeURIComponent(
          text
        )}`,
        {
          headers: {
            auth: process.env.CHAT as string,
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        message.reply({
          content: String(data.result),
          allowedMentions: {
            repliedUser: false,
          },
        });
      });
  }
}
export default ReverseCommand;
