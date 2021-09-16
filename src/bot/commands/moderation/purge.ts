/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";

abstract class PurgeCommand extends Command {
  protected constructor() {
    super({
      name: "purge",
      aliases: ["clear"],
      description: "Purge Messages",
      usage: "<prefix>purge <number>",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: ["MANAGE_MESSAGES"],
    });
  }

  public async exec(message: Message, args: string[]) {
    const qty = Math.round(Number(args[0]));
    const messages: number[] = [];
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle("Purge Messages Command");

    if (!message.member?.permissions.has("MANAGE_GUILD")) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `You have been denied to use this command. Please make sure you have Manage Guild privileges\n\nThis is check is present because this command works with the api to allow unlimited number of messages to be deleted ( as long as the messages are inside the 14 day limit ) without getting ratelimited.`
          ),
        ],
      });
    }
    if (isNaN(qty) || qty < 1) {
      return message.reply({
        embeds: [
          embed.setDescription(
            `You have specified a invalid arg which is not a number`
          ),
        ],
      });
    }
    let value;
    const amounts = Array.from(
      { length: Math.floor(qty / 99) },
      () => 99
    ).concat([qty % 99]);

    // eslint-disable-next-line no-cond-assign
    while ((value = amounts.splice(0, 1)[0])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deleted: any = await (message.channel as TextChannel)
        .bulkDelete(value, true)
        .then(
          (col) =>
            new Promise((resolve) => setTimeout(() => resolve(col), 1500))
        );
      messages.push(deleted.size);
      if (value > deleted.size) {
        amounts.length = 0;
      }
    }
    const size = this.total(messages);
    embed.setDescription(`Approximately ${size} Messages are Purged.`);
    message.channel.send({
      embeds: [embed],
    });
  }
  total(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b);
  }
}
export default PurgeCommand;

// add numbers in an array to get the to
