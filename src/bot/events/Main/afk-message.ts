/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Event from "../../struct/Event";
import { Message, MessageEmbed } from "discord.js";
import moment from "moment";
import { promisify } from 'util';
const wait = promisify(setTimeout);

abstract class MessageEvent extends Event {
  protected constructor() {
    super({
      name: "messageCreate",
    });
  }

  public async exec(message: Message) {
    if (!message.guild || message.author.bot) return;
    const guildId = message.guild.id;
    const results = await this.client.prisma.afk.findMany({
      where: {
        guildId: guildId
      }
    }).catch(() => null)


    if (message.mentions.members?.size) {
      const mentionsArray = [...message.mentions.members.keys()]
      const mentionsArray2 = mentionsArray.filter(id => id === message.author.id)
      if (results) {

        for (let i = 0; i < results.length; i++) {
          const { id, afk, timestamp } = results[i];

          if (mentionsArray2.find(string => Number(string) === Number(id))) {
            const user = message.guild.members.cache.get(`${id}`); // Send AFK message

            message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(message.guild?.me!.displayColor)
                  .setAuthor(
                    `${user?.user.username} Is AFK`,
                    user?.user.displayAvatarURL()
                  )
                  .setDescription(`${afk}`)
                  .setFooter(`${moment(Number(timestamp as BigInt)).fromNow()}`),
              ],
            });
            return;
          }
        }
      }
    }

    if (results) {
      for (let i = 0; i < results.length; i++) {
        // Loop through results
        const { id, timestamp, guildId, username } = results[i];

        if (Number(timestamp) + 1000 * 10 <= new Date().getTime()) {
          if (message.author.id === `${id}`) {
            await this.client.prisma.afk.deleteMany({
              where: {
                id: BigInt(id),
                guildId: String(guildId)
              }
            }).catch(() => null)

            message.member?.setNickname(`${username}`).catch(() => null); // Set nickname back to old nickname

            const mm = await message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(message.guild?.me!.displayColor)
                  .setDescription(
                    "<a:bounce:831518713333022736> **Welcome back, I removed your afk**"
                  ),
              ],
            });
            await wait(5000);
            await mm.delete().catch(() => null)
            return;
          }
        }
      }
    }
  }
}

export default MessageEvent;
