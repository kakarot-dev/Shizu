// /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// import Bot from "../api/Client";
// import cron from "node-cron";
// import { guild } from "../mongoose/schemas/guild";
// import {
//   MessageActionRow,
//   MessageButton,
//   MessageEmbed,
//   Permissions,
//   TextChannel,
// } from "discord.js";
// import { stripIndents } from "common-tags";
// import axios from "axios";
// import { waifu as waifuType } from "../types/endpoints";
//
// export class waifu {
//   client: Bot;
//   ImageEmbed: MessageEmbed;
//   InfoEmbed: MessageEmbed;
//   constructor(client: Bot) {
//     this.client = client;
//   }
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   public async fetch(type: string): Promise<waifuType | waifuType[]> {
//     let returnthisdammint: waifuType[] = [];
//     const response = await axios(`https://casey.gg/api/mwl?type=${type}`, {
//       headers: { token: process.env.WAIFU as string },
//     });
//     // if (response.data.status === "error") throw response.data
//     if (response.status === 400) throw response.data;
//     if (response.data.status === "error") throw response.data;
//     if (response.data["data"] instanceof Array) {
//       returnthisdammint = response.data["data"].filter(
//         (data) => !data.husbando
//       );
//       if (returnthisdammint.length === 0) {
//         throw {
//           message: `No waifus found in query[]! Please try a different search query!`,
//         };
//       } else return returnthisdammint;
//     }
//     if (response.data["data"].husbando)
//       throw {
//         message: `No waifus found in query! Please try a different search query!`,
//       };
//     return response.data["data"];
//   }
//   async init(): Promise<void> {
//     //cron.schedule("* * * * *", async () => {
//     cron.schedule("15 7 * * *", async () => {
//       //console.log("running a task every minute");
//       await this.storeEmbeds();
//       await this.handle100();
//     });
//   }
//   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
//   createImageEmbed(data): MessageEmbed {
//     return new MessageEmbed()
//       .setColor("BLUE")
//       .setURL(data.url)
//       .setTitle(data.name)
//       .setImage(data.display_picture)
//       .setFooter(`❣️ ${data.likes} likes | 💔 ${data.trash} trash`);
//   }
//   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
//   createInfoEmbed(data, imageNeeded = true): MessageEmbed {
//     const embed = new MessageEmbed()
//       .setURL(data.url)
//       .setTitle(data.name)
//       .setDescription(data.description)
//       .addField(
//         "Measurements",
//         stripIndents(`
//             **Weight**: ${data.weight ? data.weight : "Unknown"},
//             **Height**: ${data.height ? data.height : "Unknown"},
//             **Bust**: ${data.bust ? data.bust : "Unknown"},
//             **Hip**: ${data.hip ? data.hip : "Unknown"},
//             `),
//         true
//         //`${data.name} has weight ${data.weight}, height ${data.height}cm. Bust size ${data.bust}cm and hip is ${data.hip}cm`
//       )
//       .addField(
//         "Stats",
//         stripIndents(`
//       **Popularity Rank**: ${
//         data.popularity_rank ? data.popularity_rank : "Unknown"
//       },
//       **Like Rank**: ${data.like_rank ? data.like_rank : "Unknown"},
//       **Trash Rank**: ${data.trash_rank ? data.trash_rank : "Unknown"}
//       `),
//         true
//       )
//       .setColor(0xff0000)
//       .setFooter(`❣️ ${data.likes} likes | 💔 ${data.trash} trash`)
//       .setTimestamp();
//     if (imageNeeded) embed.setThumbnail(data.display_picture);
//     return embed;
//   }
//   async storeEmbeds(): Promise<void> {
//     const data = await this.fetch("dailywaifu");
//     this.ImageEmbed = this.createImageEmbed(data);
//     this.InfoEmbed = this.createInfoEmbed(data, false);
//   }
//   async handle100(): Promise<void> {
//     const db = await guild.find({
//       waifu: {
//         $exists: true,
//       },
//     });
//     if (db.length === 0) return console.log("[Shizu] No data found in the db!");
//     console.group("Waifu Channel");
//     for (const dbres of db) {
//       const guild = this.client.guilds.cache.get(`${dbres.guildId}`) ?? null;
//       if (!guild) continue;
//       const channel = guild.channels?.cache.get(
//         `${dbres.waifu}`
//       ) as TextChannel;
//       if (!channel) continue;
//       const reqperm = [
//         Permissions.FLAGS.SEND_MESSAGES,
//         Permissions.FLAGS.EMBED_LINKS,
//       ];
//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//       if (!channel.permissionsFor(channel.guild?.me!).has(reqperm)) {
//         console.log(
//           `\x1b[35m[SHARD_${this.client.shard?.ids.join(
//             " "
//           )}] \x1b[31m[Shizu]\x1b[0m: Announcement for ${guild.name} (${
//             guild.id
//           }) has \x1b[31mfailed\x1b[0m in ${
//             channel.id
//           } because i dont have perms`
//         );
//         continue;
//       }
//       const buttonRow = new MessageActionRow().addComponents([
//         new MessageButton()
//           .setStyle("SECONDARY")
//           .setCustomId("WAIFU_INFO")
//           .setEmoji("<:arihmmm:872125095034888252>"),
//       ]);
//       channel
//         .send({
//           embeds: [this.ImageEmbed],
//           components: [buttonRow],
//         })
//         .then((msg) =>
//           console.log(
//             `Sent a waifu to channel ${msg.channel.id} in the guild ${
//               msg.guild?.name
//             } (${msg.guild?.id}) at ${new Date()}`
//           )
//         )
//         .catch((e) => console.error(e.message));
//     }
//     console.groupEnd();
//   }
// }
