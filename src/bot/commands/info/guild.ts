/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";
// import Paginate from "discordjs-paginate";
import { Pagination } from "../../api/Pagination";

const filterLevels = {
  DISABLED: "Off",
  MEMBERS_WITHOUT_ROLES: "No Role",
  ALL_MEMBERS: "Everyone",
};

const verificationLevels = {
  NONE: "None",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "(╯°□°）╯︵ ┻━┻ [HIGH]",
  VERY_HIGH: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ [VERY_HIGH]",
};

// const regions = {
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		brazil: 'Brazil',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		europe: 'Europe',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		hongkong: 'Hong Kong',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		india: 'India',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		japan: 'Japan',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		russia: 'Russia',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		singapore: 'Singapore',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		southafrica: 'South Africa',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		sydeny: 'Sydeny',
// 		'us-central': 'US Central',
// 		'us-east': 'US East',
// 		'us-west': 'US West',
// 		'us-south': 'US South'
// };

abstract class ServerCommand extends Command {
  protected constructor() {
    super({
      name: "guild",
      aliases: ["server", "serverinfo"],
      description: "Gives Info about the server",
      usage: "<prefix>guild",
      category: "info",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message) {
    // **❯ Region:** ${regions[message.guild.]}

    const roles: any = message.guild?.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString());
    const channels = message.guild?.channels.cache;
    const emojis = message.guild?.emojis.cache;
    const owner = await message.guild?.fetchOwner();
    if (message.guild) {
      const embed = new MessageEmbed()
        .setDescription(`**General Info for __${message.guild.name}__**`)
        .setColor("RANDOM")
        .setThumbnail(
          message.guild.iconURL({
            dynamic: true,
          })!
        )
        .addField(
          "General",
          String(`
												**❯ Name:** ${message.guild.name}
												**❯ ID:** ${message.guild.id}
												**❯ Owner:** ${owner?.user.tag} (${message.guild.ownerId})
												**❯ Boost Tier:** ${
                          message.guild.premiumTier
                            ? `Tier ${message.guild.premiumTier}`
                            : "None"
                        }
												**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}
												**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}
												**❯ Time Created:** <t:${Math.round(message.guild.createdTimestamp / 1000)}:f>
											`)
        )
        .setTimestamp();
      const embed2 = new MessageEmbed()
        .setDescription(`**Stats for __${message.guild.name}__**`)
        .setColor("RANDOM")
        .setThumbnail(
          message.guild.iconURL({
            dynamic: true,
          })!
        )
        .addField(
          "Statistics",
          String(`
										**❯ Role Count:** ${roles?.length}
										**❯ Emoji Count:** ${emojis?.size}
										**❯ Regular Emoji Count:** ${emojis?.filter((emoji) => !emoji.animated).size}
										**❯ Animated Emoji Count:** ${
                      emojis?.filter((emoji) => emoji.animated ?? false).size
                    }
										**❯ Member Count:** ${message.guild.memberCount}
										**❯ Text Channels:** ${
                      channels?.filter(
                        (channel) => channel.type === "GUILD_TEXT"
                      ).size
                    }
										**❯ Voice Channels:** ${
                      channels?.filter(
                        (channel) => channel.type === "GUILD_VOICE"
                      ).size
                    }
										**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || "0"}`),
          true
        )
        .setTimestamp();
      const embed3 = new MessageEmbed()
        .setDescription(`**Role information for __${message.guild.name}__**`)
        .setColor("RANDOM")
        .setThumbnail(
          message.guild.iconURL({
            dynamic: true,
          })!
        )
        .addField(
          `Roles [${roles.length - 1}]`,
          String(
            roles.length < 20
              ? roles.join(", ")
              : roles.length > 20
              ? await trimArray(roles)
              : "None"
          )
        )
        .setTimestamp();
      const arrr = [embed, embed2, embed3];
      // const embeds = new Paginate(arrr, message, {
      //   appendPageInfo: true,
      //   timeout: 60000,
      //   previousbtn: "841961355799691264",
      //   nextbtn: "841961438884003870",
      //   stopbtn: "841962179490349068",
      //   // removeUserReactions: message.channel.type !== 'dm'
      //   removeUserReactions: false,
      //   removeAllReactions: false,
      // });
      // await embeds.exec();
      await new Pagination(
        message,
        message.channel as TextChannel,
        arrr,
        "Page"
      ).paginate();
    }
  }
}
export default ServerCommand;

async function trimArray(arr: string[], maxLen = 20) {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen;
    arr = arr.slice(0, maxLen);
    arr.push(`${len} more roles...`);
  }
  return arr;
}
