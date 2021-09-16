/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";

abstract class DiscordJsCommand extends Command {
  protected constructor() {
    super({
      name: "permissionsfor",
      aliases: ["perms", "permsfor"],
      description: "Find out the perms",
      usage: "<prefix>perms <search term>",
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
    let member;
    if (message.channel.type === "DM") return;
    if (!args[0]) member = message.member;
    else if (message.mentions.members?.first())
      member = message.mentions.members?.first();
    else member = await message.guild?.members.cache.get(`${BigInt(args[0])}`);
    if (!member) return;
    const sp = member.permissions.serialize();
    const cp = message.channel.permissionsFor(member).serialize();

    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(member.displayColor || "GREY")
          .setTitle(`${member.displayName}'s Permissions`)
          .setDescription(
            [
              "\\♨️ - This Server",
              "\\#️⃣ - The Current Channel",
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
export default DiscordJsCommand;
