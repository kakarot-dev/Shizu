/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class CharCommand extends Command {
  protected constructor() {
    super({
      name: "char",
      aliases: ["character"],
      description: "character search : )",
      usage: "<prefix>char <search>",
      category: "misc",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 1,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[], prefix: string) {
    let arr = axios.get("https://anime.rovi.me/list").then((res) => {
      arr = [];
      res.data.characters.forEach((c) => {
        arr.push(c["full name"]);
      });
      return arr;
    });

    switch (args[0]) {
      case "random":
        axios
          .get("https://anime.rovi.me/random?g=female")
          .then((res) => {
            const embed = new MessageEmbed()
              .setImage(res.data.url)
              .setColor("RANDOM")
              .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({
                  dynamic: true,
                  size: 2048,
                  format: "png",
                })
              );
            message.channel.send({
              embeds: [embed],
            });
          })
          .catch(() => {
            message.channel.send({
              content:
                "It apears that there was an error. Please try again later.",
            });
          });
        break;
      case "list":
        arr.then((arr: string[]) => {
          const embed = new MessageEmbed()
            .setTitle("Available Characters")
            .setDescription(arr.join("\n"))
            .setColor("RANDOM")
            .setFooter(
              `Requested by ${message.author.tag}`,
              message.author.displayAvatarURL({
                dynamic: true,
                size: 2048,
                format: "png",
              })
            );
          message.author
            .send({
              embeds: [embed],
            })
            .catch(async (e) => {
              return message.channel.send({
                content: `${e.message}`,
              });
            })
            .then(() =>
              message.channel.send({
                content: "Check ur dms",
              })
            );
        });

        break;
      default:
        arr.then((arr) => {
          const checker: string[] = [];
          arr.forEach((c: string) => checker.push(c.toLowerCase()));
          if (!checker.includes(args.join(" ").toLowerCase()))
            return message.channel.send({
              content: `That character isn't in the list, please do \`${prefix}character list\` to check`,
            });

          axios
            .get(`https://anime.rovi.me/random?c=${args.join("+")}`)
            .then((res) => {
              const embed = new MessageEmbed()
                .setImage(res.data.url)
                .setTitle(`Random picture of ${args.join(" ")}`)
                .setColor("RANDOM")
                .setFooter(
                  `Requested by ${message.author.tag}`,
                  message.author.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: "png",
                  })
                );
              message.channel.send({
                embeds: [embed],
              });
            });
        });
    }
  }
}
export default CharCommand;
