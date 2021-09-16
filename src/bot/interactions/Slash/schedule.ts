/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildChannel,
  GuildMember,
  MessageEmbed,
} from "discord.js";
import Interaction from "../../struct/Interaction";
import momentTimezone from "moment-timezone";
import { Schedule_Schema as scheduledSchema } from "../../mongoose/schemas/schedule";

abstract class ScheduleInteraction extends Interaction {
  constructor() {
    super({
      name: "schedule",
      description: "Schedule messages",
      options: [
        {
          type: 7,
          name: "channel",
          description: "Channel to send the message",
          required: true,
        },
        {
          type: 3,
          name: "date",
          description: "Date to send the message (eg: <YYYY/MM/DD>)",
          required: true,
        },
        {
          type: 3,
          name: "hour-min",
          description: "Time to send the message (eg: <HH:MM>)",
          required: true,
        },
        {
          type: 3,
          name: "am-pm",
          description:
            'when to send the message (eg:  <\\"AM\\" or \\"PM\\"> )',
          required: true,
        },
        {
          type: 3,
          name: "timezone",
          description:
            "Timezone of the time u want to send the message (eg: <Timezone>)",
          required: true,
        },
        {
          type: 3,
          name: "message",
          description: "Message you want to schedule",
          required: true,
        },
      ],
    });
  }

  public async exec(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    if (!interaction.guild)
      return interaction.reply({
        content: `Make sure this is a guild`,
      });
    //  const channel = interaction.channel as TextChannel
    const member = interaction.member as GuildMember;
    if (!member.permissions.has("ADMINISTRATOR"))
      return interaction.reply({
        content: `You dont have permission to use this command`,
      });
    // if (!channel?.permissionsFor(interaction.guild?.me!).has('ADMINISTRATOR')) return interaction.reply(`You dont have permission to use this command`);
    const { guild } = interaction;
    const targetChannel = args.getChannel("channel") as GuildChannel;
    if (targetChannel.type !== "GUILD_NEWS") {
      return interaction.reply({
        content: `This is not a valid channel, Make sure this is a news channel`,
        ephemeral: true,
      });
    }
    const date = args.getString("date") as string;
    const time = args.getString("hour-min") as string;
    const clockType = args.getString("am-pm") as string;
    const timeZone = args.getString("timezone") as string;
    const content = args.getString("message") as string;
    //    const [date, time, clockType, timeZone, content] = args;

    if (clockType !== "AM" && clockType !== "PM") {
      interaction.reply({
        content: `You must provide either "AM" or "PM", you provided "${clockType}"`,
        ephemeral: true,
      });
      return;
    }
    const validTimeZones = momentTimezone.tz.names();
    if (!validTimeZones.includes(timeZone)) {
      interaction.reply({
        content:
          "Unknown timezone! Please use one of the following: <https://cdn.discordapp.com/attachments/820856889574293514/823487572281524254/message.txt>",
        ephemeral: true,
      });
      return;
    }
    const targetDate = momentTimezone.tz(
      `${date} ${time} ${clockType}`,
      "YYYY-MM-DD HH:mm A",
      timeZone
    );
    // if (content.value.length > 2000) {
    //     interaction.reply({
    //         content: `Message Content too large, Make sure it is below 2000`,
    //         ephemeral: true
    //     })
    // }
    await new scheduledSchema({
      date: targetDate.valueOf(),
      content: content,
      guildId: guild.id,
      channelId: targetChannel.id,
    }).save();

    await interaction.reply({
      embeds: [
        new MessageEmbed().setColor("GREEN").setDescription(`
        The embed will be sent to ${targetChannel} at <t:${Math.round(
          targetDate.valueOf() / 1000
        )}:f> (<t:${Math.round(targetDate.valueOf() / 1000)}:R>)
        `),
      ],
    });
  }
}

export default ScheduleInteraction;
