/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {Message, MessageEmbed} from "discord.js";
import {stripIndents} from "common-tags";

abstract class DiscordJsCommand extends Command {
    protected constructor() {
        super({
            name: "privacy-policy",
            aliases: ["policy"],
            description: "Shows the privacy policy of the bot.",
            usage: "<prefix>privacy-policy",
            category: "info",
            cooldown: 2,
            ownerOnly: false,
            guildOnly: false,
            requiredArgs: 0,
            userPermissions: [],
            clientPermissions: [],
        });
    }

    public async exec(message: Message) {
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Privacy Policy of Shizu")
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({dynamic: true})
            )
            .setDescription(
                stripIndents(`
     ** 1) What data does this bot store?**

- Guild IDs
- Channel IDs
- User IDs
- Role IDs
- User Tags

**2) Why do we need the data, and why do we use this data?**
    1) Guilds IDs are stored for every of our database schemas.
    2) Channel IDs are stored for moderation log, anischedule, discord-status, etc.
    3) User IDs are stored for moderation actions (mutes, afk etc).
    4) Role IDs are stored for mute role.

**3) Other than Discord, do we share your data with any 3rd parties?**
   No, we do not share data with any 3rd parties!
   However, if requested by law enforcement, we will legally need to disclose that information.

**4) How can users get data removed, or how can users contact the bot owner?**
   They can contact me, Kakarot#8194
      `)
            );
        return message.channel.send({
            embeds: [embed],
        });
    }
}

export default DiscordJsCommand;
