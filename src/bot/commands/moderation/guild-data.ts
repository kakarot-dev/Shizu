// import Command from "../../struct/Command";
// import { Message, MessageEmbed } from "discord.js";
// import { guild } from "../../mongoose/schemas/guild";
//
// abstract class GuildDataCommand extends Command {
//   protected constructor() {
//     super({
//       name: "guild-data",
//       aliases: [],
//       description: "Add or remove guilds data in the database",
//       usage: "<prefix>guild-data <add/remove>",
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
//   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
//   public async exec(message: Message, args: string[], prefix: string) {
//     const data = this.client.cache.getData(message.guild?.id);
//     switch (args[0]) {
//       case "add":
//         {
//           if (data) {
//             return message.channel.send({
//               embeds: [
//                 new MessageEmbed()
//                   .setColor("GREEN")
//                   .setDescription(
//                     "This guild has already been added to my data base 😄"
//                   ),
//               ],
//             });
//           } else {
//             await new guild({
//               guildId: String(message.guild?.id),
//             }).save();
//             this.client.cache.data.set(String(message.guild?.id), {
//               modlogChannelId: null,
//               suggestChannelId: null,
//               prefix: null,
//               ioc: {
//                 enabled: false,
//                 color: "no",
//               },
//             });
//             message.channel.send({
//               embeds: [
//                 new MessageEmbed()
//                   .setColor("GREEN")
//                   .setDescription(
//                     "**I saved the data to the database!**\nThank you for registering"
//                   ),
//               ],
//             });
//           }
//         }
//         break;
//       case "remove":
//         {
//           if (!data)
//             return message.channel.send({
//               embeds: [
//                 new MessageEmbed()
//                   .setColor("RED")
//                   .setDescription(
//                     "This guild has not been saved in my data base.\nPlease report this if this information is wrong, or use the add subcommand"
//                   ),
//               ],
//             });
//           await guild.findOneAndDelete({
//             guildId: String(message.guild?.id),
//           });
//           this.client.cache.data.delete(String(message.guild?.id));
//           message.channel.send({
//             embeds: [
//               new MessageEmbed()
//                 .setColor("RED")
//                 .setDescription(
//                   "I deleted this guild from my cache and my database"
//                 ),
//             ],
//           });
//         }
//         break;
//       default:
//         this.client.commands.get("help")?.exec(message, ["guild-data"], prefix);
//     }
//   }
// }
// export default GuildDataCommand;
