// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-empty */
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import Command from "../../struct/Command";
// import {
//   Message,
//   MessageActionRow,
//   MessageButton,
//   TextChannel,
// } from "discord.js";
// import { watchList } from "../../mongoose/schemas/GuildWatchList";
//
// abstract class AnischedCommand extends Command {
//   protected constructor() {
//     super({
//       name: "anischedule",
//       aliases: ["anisched"],
//       description: "Set the channel for anischedule",
//       usage: "<prefix>anisched <disable/set> <set-channel>",
//       category: "mods",
//       cooldown: 10,
//       ownerOnly: false,
//       guildOnly: true,
//       requiredArgs: 1,
//       userPermissions: ["MANAGE_GUILD"],
//       clientPermissions: [],
//     });
//   }
//
//   public async exec(message: Message, args: string[], prefix: string) {
//     const document = await watchList.findById(String(message.guild?.id));
//     const row = new MessageActionRow().addComponents([
//       new MessageButton()
//         .setLabel(`Report this here`)
//         .setStyle("LINK")
//         .setURL(`https://discord.gg/b7HzMtSYtX`),
//     ]);
//
//     if (document instanceof Error)
//       return message.channel.send({
//         content: `A error has occurred! Pls report this to the devs`,
//         components: [row],
//       });
//     switch (args[0]) {
//       case "set":
//         {
//           if (!document) {
//             const cid =
//               message.mentions.channels.first() ??
//               message.guild?.channels.cache.get(`${BigInt(args[1])}`);
//             if (!cid) {
//               return message.reply(
//                 `Could\\'nt find a channel! Please provide a valid Id`
//               );
//             }
//             if (!(cid instanceof TextChannel)) {
//               return message.reply(
//                 `This is not a valid channel, This is is a invalid channel tagged\nMake sure the tagged is a text channel`
//               );
//             }
//             await new watchList({
//               _id: String(message.guild?.id),
//               channelId: cid.id,
//             }).save();
//             return message.reply({
//               content: `Anischedule channel set to ${cid}`,
//             });
//           } else if (document) {
//             message.reply({
//               content: `This server already has the anischedule channel set to ${document.channelId}\nTo disable it, please use this command along with the disable option`,
//             });
//           }
//         }
//         break;
//       case "disable":
//         {
//           if (!document) {
//             return message.channel.send({
//               content: `This server does not have anischedule system registered.\nTo enable the system, pls use this command along with the set option`,
//             });
//           } else if (document) {
//             await watchList.findByIdAndRemove(message.guild?.id);
//             return message.reply({
//               content: `**Successfuly Reset the Anischedule System on your Server!**\npls use this command again with the set option re-setup!`,
//             });
//           }
//         }
//         break;
//       default:
//         this.client.commands.get("help")?.exec(message, ["anisched"], prefix);
//     }
//   }
// }
// export default AnischedCommand;
