/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
  Message,
  MessageEmbed,
  DMChannel,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  GuildChannel,
  Snowflake,
  ButtonInteraction,
} from "discord.js";

abstract class ChannelCommand extends Command {
  protected constructor() {
    super({
      name: "channel",
      aliases: [],
      description: "<delete/create/clone> a channel",
      usage:
        "<prefix>channel <delete/create/clone> [if create= channel name == if delete = channel tag == if clone = channel tag]",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_CHANNELS"],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[], prefix: string) {
    const filter = (interaction: ButtonInteraction) => {
      if (
        (interaction.customId === "yesc" || interaction.customId === "noc") &&
        interaction.user.id !== message.author.id
      ) {
        interaction.reply({
          content: `You cant use this. If you are a mod, Please use the command by youself.`,
          ephemeral: true,
        });
        return false;
      } else return true;
    };
    if (args[1] === message.channel.id)
      return message.reply({
        content: `Pls use this command in another channel`,
      });
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("yesc")
        .setLabel("Yep")
        .setStyle("SUCCESS")
        .setEmoji("<:tick:868436462021013504>"),
      new MessageButton()
        .setCustomId("noc")
        .setEmoji("<:wrong:868437691765755964>")
        .setLabel("Nope")
        .setStyle("DANGER"),
    ]);
    switch (args[0]) {
      case "delete":
        const g = args[1] as Snowflake;
        const target =
          message.mentions.channels.first() ||
          (await message.guild?.channels.cache.get(g));
        if (!target)
          return message.reply({
            content: `Channel not valid`,
          });
        if (message.guild?.rulesChannelId === target.id)
          return message.reply({
            content: `Rules channels cannot be deleted`,
          });
        if (message.guild?.systemChannelId === target.id)
          return message.reply({
            content: `System logs channel can not be deleted`,
          });
        // if (!target.deletable) return message.reply(`This channel can not be deleted`)
        const confirmationEmbed = new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({
              dynamic: true,
            })
          )
          .setThumbnail(
            `https://cdn.discordapp.com/attachments/831552576180322305/848846833845141554/294766366044211.png`
          )
          .setTitle(`Channel deletion request`)
          .setDescription(`Do u want to delete ${target}`);
        const mes = await message.reply({
          embeds: [confirmationEmbed],
          components: [row],
          allowedMentions: {
            repliedUser: true,
          },
        });

        const collector = mes.createMessageComponentCollector({
          filter,
          time: 1000 * 15,
          max: 1,
        });

        collector.on("end", async (collected) => {
          const hello = collected.first() as MessageComponentInteraction;
          if (!hello) {
            const hell = new MessageEmbed()
              .setTitle("Time limited to 15 sec")
              .setFooter(
                "You did not react to the buttons within the time allocated"
              )
              .setColor("DARK_BUT_NOT_BLACK")
              .setDescription(
                "Please select One of the following buttons with these emojis"
              )
              .addField("The Yes Emoji", "<:tick:868436462021013504>")
              .addField("The No Emoji", "<:wrong:868437691765755964>");
            await mes.edit({
              components: [],
              embeds: [hell],
            });
            return;
          }
          if (hello.customId === "yesc") {
            await target.delete();
            const dell = new MessageEmbed()
              .setTitle("Channel Deleted : )")
              .setTimestamp()
              .setColor("RANDOM")
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({
                  dynamic: true,
                })
              );
            await mes.edit({
              components: [],
              embeds: [dell],
            });
          } else {
            const cancelEmbed = new MessageEmbed()
              .setColor("GREEN")
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({
                  dynamic: true,
                })
              )
              .setTitle(`Cancelled deleting of the channel!`)
              .setDescription(`Escaped **Deletion** of ${target}`);
            await mes.edit({
              components: [],
              embeds: [cancelEmbed],
            });
          }
        });
        break;
      case "create":
        const confirmationEmbed2 = new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({
              dynamic: true,
            })
          )
          .setTitle(`Channel Creation request`)
          .setDescription(`Do u want to create a channel named ${args[1]}`)
          .setThumbnail(
            `https://cdn.discordapp.com/attachments/831552576180322305/848846833845141554/294766366044211.png`
          );
        const mes2 = await message.reply({
          embeds: [confirmationEmbed2],
          components: [row],
          allowedMentions: {
            repliedUser: true,
          },
        });

        const collector2 = mes2.createMessageComponentCollector({
          filter,
          time: 1000 * 15,
          max: 1,
        });
        collector2.on("end", async (collected) => {
          const hello = collected.first() as MessageComponentInteraction;
          if (!hello) {
            const hell = new MessageEmbed()
              .setTitle("Time limited to 15 sec")
              .setFooter(
                "You did not react to the buttons within the time allocated"
              )
              .setColor("DARK_BUT_NOT_BLACK")
              .setDescription(
                "Please select One of the following buttons with these emojis"
              )
              .addField("The Yes Emoji", "<:tick:868436462021013504>")
              .addField("The No Emoji", "<:wrong:868437691765755964>");
            await mes2.edit({
              components: [],
              embeds: [hell],
            });
            return;
          }
          if (hello.customId === "yesc") {
            if (message.channel instanceof DMChannel) return;
            await message.guild?.channels.create(`${args[1]}`, {
              type: "GUILD_TEXT",
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              parent: message.channel.parentId
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                ? message.channel.parentId
                : undefined,
            });
            const done = new MessageEmbed()
              .setColor("RANDOM")
              .setTitle(`Channel creation request`)
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({
                  dynamic: true,
                })
              )
              .setDescription(`Channel created succesfully`)
              .setTimestamp();
            await mes2.edit({
              components: [],
              embeds: [done],
            });
          } else {
            const cancelEmbed = new MessageEmbed()
              .setColor("GREEN")
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({
                  dynamic: true,
                })
              )
              .setTitle(`Cancelled creation of text channel!`);
            await mes2.edit({
              components: [],
              embeds: [cancelEmbed],
            });
          }
        });
        break;
      case "clone":
        const g2 = args[1] as Snowflake;
        const target3 =
          message.mentions.channels.first() ||
          message.guild?.channels.cache.get(g2);
        if (!target3) return message.reply(`Channel not valid`);
        const confirmationEmbed3 = new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({
              dynamic: true,
            })
          )
          .setTitle(`Channel Clone request`)
          .setDescription(`Do u want to Clone ${target3}`)
          .setThumbnail(
            `https://cdn.discordapp.com/attachments/831552576180322305/848846833845141554/294766366044211.png`
          );
        const mes3 = await message.reply({
          embeds: [confirmationEmbed3],
          components: [row],
          allowedMentions: {
            repliedUser: true,
          },
        });

        const collector4 = mes3.createMessageComponentCollector({
          filter,
          time: 1000 * 15,
          max: 1,
        });
        collector4.on("end", async (collected) => {
          const hello3 = collected.first() as MessageComponentInteraction;
          if (!hello3) {
            const hell3 = new MessageEmbed()
              .setTitle("Time limited to 15 sec")
              .setFooter(
                "You did not react to the buttons within the time allocated"
              )
              .setColor("DARK_BUT_NOT_BLACK")
              .setDescription(
                "Please select One of the following buttons with these emojis"
              )
              .addField("The Yes Emoji", "<:tick:868436462021013504>")
              .addField("The No Emoji", "<:wrong:868437691765755964>");

            await mes3.edit({
              components: [],
              embeds: [hell3],
            });
            return;
          }
          if (hello3.customId === "yesc") {
            if (!message.guild) return;
            const chan = target3 as GuildChannel;
            await chan.clone();
            const done3 = new MessageEmbed()
              .setColor("RANDOM")
              .setTitle(`Channel Clone request`)
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({
                  dynamic: true,
                })
              )
              .setDescription(`Channel cloned succesfully`)
              .setTimestamp();
            await mes3.edit({
              components: [],
              embeds: [done3],
            });
          } else {
            const cancelEmbed3 = new MessageEmbed()
              .setColor("GREEN")
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({
                  dynamic: true,
                })
              )
              .setTitle(`Cancelled Cloning of text channel!`)
              .setDescription(`Escaped **Cloning** of ${target3}`);
            await mes3.edit({
              components: [],
              embeds: [cancelEmbed3],
            });
          }
        });
        break;
      default:
       await message.reply(
          `Tell me one of the following \`\`\`delete = ${prefix}channel delete <channel-tag>\ncreate = ${prefix}channel create <channel-name>\nclone = ${prefix}channel clone <channel-tag>\`\`\``
        );
    }
  }
}
export default ChannelCommand;
