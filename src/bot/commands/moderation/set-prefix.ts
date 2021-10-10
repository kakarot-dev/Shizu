// /* eslint-disable no-empty */
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import Command from "../../struct/Command";
// import { Message } from "discord.js";
// import { guild as schema } from "../../mongoose/schemas/guild";
//
// abstract class PrefixCommand extends Command {
//   protected constructor() {
//     super({
//       name: "prefix",
//       aliases: ["prefix"],
//       description: "Prefix for the bot",
//       usage: "<prefix>prefix <set-prefix>",
//       category: "mods",
//       cooldown: 0,
//       cachedData: true,
//       ownerOnly: false,
//       guildOnly: true,
//       requiredArgs: 0,
//       userPermissions: ["MANAGE_GUILD"],
//       clientPermissions: [],
//     });
//   }
//
//   public async exec(message: Message, args: string[], prefix: string) {
//     if (args.join(" ").trim() === prefix)
//       return message.channel.send({
//         content: `The prefix ur suggesting is still the same prefix being used in this command`,
//       });
//     const prefixess = args.join(" ");
//     if (prefixess.length > 20)
//       return message.channel.send({
//         content: `Prefix is too long, Pls make sure it is smaller than 20`,
//       });
//
//     await schema.findOneAndUpdate(
//       {
//         guildId: message.guild?.id,
//       },
//       {
//         $set: {
//           prefix: prefixess,
//         },
//       }
//     );
//
//     const data = this.client.cache.getData(message.guild?.id);
//     if (data) data.prefix = prefixess;
//     await message.channel.send({
//       content: `Prefix has been updated from ${prefix} to ${prefixess}`,
//     });
//   }
// }
// export default PrefixCommand;
