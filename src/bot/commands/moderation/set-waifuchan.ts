// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import Command from "../../struct/Command";
// import { Message, TextChannel } from "discord.js";
// import { guild as schema } from "../../mongoose/schemas/guild";
//
// abstract class WaifuChannel extends Command {
//     protected constructor() {
//         super({
//             name: "waifuchannel",
//             aliases: ["set-waifuchan"],
//             description: "Set a channel for the mod logs",
//             usage: "<prefix>set-waifuchannel <disable/set> <set-channel>",
//             category: "mods",
//             cachedData: true,
//             cooldown: 10,
//             ownerOnly: false,
//             guildOnly: true,
//             requiredArgs: 0,
//             userPermissions: ["MANAGE_GUILD"],
//             clientPermissions: [],
//         });
//     }
//
//     public async exec(message: Message, args: string[], prefix: string): Promise<void> {
//         const data = this.client.cache.getData(message.guild?.id);
//         switch (args[0]) {
//             case "set":
//                 // eslint-disable-next-line no-case-declarations
//                 if (data && !data.waifu) {
//                     const cid =
//                         message.mentions.channels.first() ??
//                         message.guild?.channels.cache.get(`${BigInt(args[1])}`);
//                     if (!cid) {
//                         await message.reply(
//                             `Could\\'nt find a channel! Please provide a valid Id`
//                         );
//                         return
//                     }
//                     if (!(cid instanceof TextChannel)) {
//                          await message.reply(
//                             `This is not a valid channel tagged, Make sure this this is a text channel`
//                         );
//                         return
//                     }
//                     await schema.findOneAndUpdate(
//                         {
//                             guildId: message.guild?.id,
//                         },
//                         {
//                             $set: {
//                                 waifu: cid.id,
//                             },
//                         }
//                     );
//                     data.waifu = cid.id;
//                    await message.reply({
//                         content: `Waifu channel set to ${cid}`,
//                     });
//                 } else if (data && data.waifu) {
//                     await message.channel.send({
//                         content: `This Guild already has a log channel set to <#${data.waifu}>\nPlease use the same command again, except use the the disable option`,
//                     });
//                 }
//                 break;
//             case "disable":
//                 if (data && !data.waifu) {
//                     await message.reply({
//                         content: `This Guild dosent have waifu set up.\nPlease use this same command again except use the set option`,
//                     });
//                 } else if (data && data.waifu) {
//                     await schema.findOneAndUpdate(
//                         {
//                             guildId: String(message.guild?.id),
//                         },
//                         {
//                             $unset: {
//                                 waifu: "",
//                             },
//                         }
//                     );
//                     data.waifu = null;
//                     await message.channel.send({
//                         content: `**Successfuly Reset the Waifu System on your Server!**\nPlease use the command again with the set option to re-setup!`,
//                     });
//                 }
//                 break;
//             default:
//                 this.client.commands
//                     .get("help")
//                     ?.exec(message, ["set-waifuchannel"], prefix);
//         }
//     }
// }
// export default WaifuChannel;
