/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";

abstract class ErrorUrlCommand extends Command {
    protected constructor() {
        super({
            name: "error",
            aliases: [],
            description: "",
            usage: "<prefix>error <uuid>",
            category: "Devs",
            cooldown: 2,
            ownerOnly: true,
            guildOnly: false,
            requiredArgs: 1,
            userPermissions: [],
            clientPermissions: [],
        });
    }

    public async exec(message: Message, args: Array<string>) {
        const embed = new MessageEmbed()
            .setDescription(`https://rollbar.com/item/uuid/?uuid=${args[0]}`)
            .setColor("RANDOM");
        return message.channel.send({
            embeds: [embed],
        });
    }
}
export default ErrorUrlCommand;
