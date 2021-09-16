/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Event from "../../struct/Event";
import { afk as afkSchema } from "../../mongoose/schemas/afk";
import { Message, MessageEmbed } from "discord.js";
import moment from "moment";
import { promisify } from 'util';
const wait = promisify(setTimeout);

abstract class MessageEvent extends Event {
  constructor() {
    super({
      name: "messageCreate",
    });
  }

  public async exec(message: Message) {
    if (!message.guild) return;
    const guildId = message.guild.id;
    if (message.mentions.members?.first()) {
      // If message mentions someone
      // tslint:disable-next-line: await-promise
      const results = await afkSchema.find({
        guildId,
      }); // Find results

      if (results) {
        // If results exist sort through each one
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < results.length; i++) {
          const { userId, afk, timestamp } = results[i];
          if (message.mentions.members.first()!.id === message.author.id)
            return; // If the author is the one pinged themselve return

          if (message.mentions.members.first()!.id === userId) {
            const user = message.guild.members.cache.get(`${BigInt(userId)}`); // Send AFK message

            message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(message.guild?.me!.displayColor)
                  .setAuthor(
                    `${user?.user.username} Is AFK`,
                    user?.user.displayAvatarURL()
                  )
                  .setDescription(`${afk}`)
                  .setFooter(`${moment(timestamp).fromNow()}`),
              ],
            });
            return;
          }
        }
      }
    }

    // tslint:disable-next-line: await-promise
    const afkResults = await afkSchema.find({
      guildId,
    }); // Fetch results again
    if (afkResults) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < afkResults.length; i++) {
        // Loop through results
        const { userId, timestamp, username } = afkResults[i];

        if (timestamp + 1000 * 10 <= new Date().getTime()) {
          // If author sends a message from less than 10 seconds before they used the command, it ignores

          if (message.author.id === userId) {
            // tslint:disable-next-line: await-promise
            await afkSchema.findOneAndDelete({
              guildId,
              userId,
            }); // Delete from document

            message.member?.setNickname(`${username}`).catch(async () => {
              return;
            }); // Set nickname back to old nickname

            const mm = await message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(message.guild?.me!.displayColor)
                  .setDescription(
                    "<a:bounce:831518713333022736> **Welcome back, I removed your afk**"
                  ),
              ],
            });
            wait(2000);
            await mm.delete().catch(() => null)
            return;
          }
        }
      }
    }
  }
}

export default MessageEvent;
