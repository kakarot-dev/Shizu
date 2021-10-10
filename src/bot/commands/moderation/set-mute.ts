// import { guild as Schema } from "../../mongoose/schemas/guild";
// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import Command from "../../struct/Command";
// import { Message } from "discord.js";
// abstract class MuteRoleCommand extends Command {
//   protected constructor() {
//     super({
//       name: "mute-role",
//       aliases: [],
//       description: "Set a Mute role",
//       usage: "<prefix>set-mute <role>",
//       category: "mods",
//       cooldown: 120,
//       ownerOnly: false,
//       guildOnly: true,
//       requiredArgs: 0,
//       userPermissions: ["MANAGE_ROLES"],
//       clientPermissions: [
//         "ADD_REACTIONS",
//         "USE_EXTERNAL_EMOJIS",
//         "MANAGE_ROLES",
//       ],
//     });
//   }
//
//   // tslint:disable-next-line: promise-function-async
//   public async exec(message: Message, args: string[]) {
//     const checkdata = await Schema.findOne({
//       guildId: message.guild?.id,
//       muteRoleId: { $exists: true },
//     });
//     if (!checkdata) {
//       if (!args[0])
//         return message.channel.send({
//           content: `Didnt find your data in our data base\nTry tagging the role for setting it up`,
//         });
//       const target =
//         message.mentions.roles.first() ||
//         message.guild?.roles.cache.get(`${BigInt(args[0])}`);
//       if (!target)
//         return message.channel.send({
//           content: `Can\\'t find the role u specified`,
//         });
//       await Schema.findOneAndUpdate(
//         {
//           guildId: message.guild?.id,
//         },
//         {
//           $set: {
//             muteRoleId: target.id,
//           },
//         }
//       );
//       await message.reply({
//         content: `The muted role has been set to ${target}`,
//       });
//     } else if (checkdata) {
//       await Schema.findOneAndRemove({
//         guildId: message.guild?.id,
//       });
//       message.reply({
//         content: `**Successfuly Reset the Mute System on your Server!**\npls use this command again to re-setup!`,
//       });
//     }
//   }
// }
// export default MuteRoleCommand;
