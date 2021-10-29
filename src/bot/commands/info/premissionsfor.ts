/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
    GuildMember,
    Message,
    MessageEmbed,
    NewsChannel,
    TextChannel,
    ThreadChannel,
    Channel,
    GuildChannel
} from "discord.js";

abstract class PermissionsCommand extends Command {
  protected constructor() {
    super({
      name: "permissionsfor",
      aliases: ["perms", "permsfor"],
      description: "Find out the perms",
      usage: "<prefix>perms [channel mention] [member mention/id]",
      category: "info",
      cooldown: 5,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: string[]) {
    let member: GuildMember | undefined;
    let channel:  Channel | undefined;
    if (message.channel.type === "DM") return;
      const argIndex: number = message.mentions.channels.first() ? 1 : 0
      if (!args[0] || !args[1]) {
          member = message.member as GuildMember;
      }
      if (message.mentions.members?.first()) member = message.mentions.members?.first();
      else if (!member) member = message.guild?.members.cache.get(`${BigInt(args[argIndex])}`) || (await message.guild?.members.fetch(args[argIndex]));
    if (!member) return;
    channel = message.mentions.channels.filter(channel => {
        if (channel instanceof TextChannel || channel instanceof NewsChannel || channel instanceof ThreadChannel) {
            return true
        }
        else return false
    }).first();
    if (!channel) channel = message.channel
    const sp = member.permissions.serialize();
    const cp = (channel as GuildChannel).permissionsFor(member).serialize();

    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(member.displayColor || "GREY")
          .setTitle(`${member.displayName}'s Permissions`)
          .setDescription(
            [
              "\\♨️ - This Server",
              "\\#️⃣ - <#" + (channel as GuildChannel).id + ">",
              "```properties",
              "♨️ | #️⃣ | Permission",
              "========================================",
              `${Object.keys(sp)
                .map((perm) =>
                  [
                    sp[perm] ? "✔️ |" : "❌ |",
                    cp[perm] ? "✔️ |" : "❌ |",
                    perm
                      .split("_")
                      .map((x) => x[0] + x.slice(1).toLowerCase())
                      .join(" "),
                  ].join(" ")
                )
                .join("\n")}`,
              "```",
            ].join("\n")
          ),
      ],
    });
  }
}
export default PermissionsCommand;
