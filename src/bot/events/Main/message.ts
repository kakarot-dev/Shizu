/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Event from "../../struct/Event";
// import { guild } from "../../mongoose/schemas/guild";
import {
  Message,
  TextChannel,
  Guild,
  Collection,
  MessageEmbed,
} from "discord.js";
import settings from "../../settings";

abstract class MessageEvent extends Event {
  protected constructor() {
    super({
      name: "messageCreate",
    });
  }

  public async exec(message: Message): Promise<void> {
    const embed = new MessageEmbed().setColor("RED");
    const data = this.client.cache.getData(message.guild?.id);
    // await new guild({
    //   guildId: message.guild?.id,
    // }).save();
    // const prefix = message.guild ? getPrefix(message.guild.id) ? getPrefix(message.guild.id) : this.client.defaultprefix : this.client.defaultprefix
    let prefix = message.guild
      ? this.client.cache.getPrefix(message.guild.id)
      : this.client.defaultprefix;
    if (!prefix) prefix = this.client.defaultprefix;
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandNam: string | undefined = args.shift();
    const commandName = commandNam;
    if (commandName) {
      const command = this.client.commands.get(commandName);
      if (command) {
        if (message.mentions.channels.first()) {
          const ch = message.mentions.channels.first();
          if (
            ch?.type === "GUILD_PRIVATE_THREAD" ||
            ch?.type === "GUILD_NEWS_THREAD" ||
            ch?.type === "GUILD_PUBLIC_THREAD"
          ) {
            message.channel.send({
              embeds: [
                embed.setDescription(
                  `You have mentioned a channel which is a thread\n${this.client.user.tag} is not suitable with threads yet`
                ),
              ],
            });
            return;
          }
        }

        if (command.cachedData && !data) {
          message.channel.send({
            embeds: [
              embed.setDescription(
                "This guild is not cached in my memory!.\nPlease use the command `guild-data add` then use `" +
                  commandName +
                  "`."
              ),
            ],
          });
          return;
        }
        if (
          command.ownerOnly &&
          !settings.BOT_OWNER_ID.includes(message.author.id)
        ) {
          message.channel.send({
            embeds: [
              embed.setDescription(
                "This command can only be used by the owner of the bot."
              ),
            ],
          });
          return;
        } else if (command.guildOnly && !(message.guild instanceof Guild)) {
          message.channel.send({
            embeds: [
              embed.setDescription("This command can only be used in a guild."),
            ],
          });
          return;
        }
        if (message.channel instanceof TextChannel && message.member) {
          const userPermissions = command.userPermissions;
          const clientPermissions = command.clientPermissions;
          const missingPermissions: string[] = [];
              const userRoles =  [...message.member.roles.cache.keys()];
              const has_role: boolean | undefined = data?.modRoles?.some(id => userRoles.includes(id));
              if (!has_role && userPermissions?.length) {
                for (let i = 0; i < userPermissions.length; i++) {
                  const hasPermission = message.member?.permissions.has(
                      userPermissions[i]
                  );
                  if (!hasPermission) {
                    missingPermissions.push(userPermissions[i]);
                  }
                }
                if (missingPermissions.length) {
                  await message.channel.send({
                    embeds: [
                      embed.setDescription(
                          String(
                              `Your missing these required permissions: ${missingPermissions.join(
                                  ", "
                              )}`
                          )
                      ),
                    ],
                  });
                  return;
                }
          }
          if (clientPermissions?.length) {
            for (let i = 0; i < clientPermissions.length; i++) {
              const hasPermission = message.guild?.me?.permissions.has(
                clientPermissions[i]
              );
              if (!hasPermission) {
                missingPermissions.push(clientPermissions[i]);
              }
            }
            if (missingPermissions.length) {
             await message.channel.send({
                embeds: [
                  embed.setDescription(
                    String(
                      `I\\'m missing these required permissions: ${missingPermissions.join(
                        ", "
                      )}`
                    )
                  ),
                ],
              });
              return;
            }
          }
        }
        if (command.requiredArgs && command.requiredArgs > args.length) {
          message.channel.send({
            embeds: [
              embed.setDescription(
                String(
                  `Invalid usage of this command, please refer to \`${prefix}help ${command.name}\``
                )
              ),
            ],
          });
          return;
        }
        if (command.cooldown) {
          if (!this.client.cooldowns.has(command.name)) {
            this.client.cooldowns.set(command.name, new Collection());
          }
          const now = Date.now();
          const timestamps = this.client.cooldowns.get(command.name);
          const cooldownAmount = command.cooldown * 1000;
          if (timestamps?.has(message.author.id)) {
            const cooldown = timestamps.get(message.author.id);
            if (cooldown) {
              const expirationTime = cooldown + cooldownAmount;
              if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send({
                  embeds: [
                    embed.setDescription(
                      String(
                        `Wait ${timeLeft.toFixed(
                          1
                        )} more second(s) before reusing the \`${
                          command.name
                        }\` command.`
                      )
                    ),
                  ],
                });
                return;
              }
            }
          }
          timestamps?.set(message.author.id, now);
          setTimeout(
            () => timestamps?.delete(message.author.id),
            cooldownAmount
          );
        }
        command.exec(message, args, prefix).catch((err) => {
          const id = this.client.rollbar.error(err)
          embed.setDescription(err.message + "\n\n" + `Report the problem with the id: \`${id.uuid}\``);
          embed.setTitle("Error Message");
          message.channel.send({
            embeds: [embed],
          });
        });
        return;
      }
    }
  }
}

export default MessageEvent;
