/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    ContextMenuInteraction, GuildMember, GuildMemberRoleManager, MessageEmbed, User
} from "discord.js";
import Menu from "../../../struct/Menu";

abstract class whoisInteraction extends Menu {
    protected constructor() {
        super({
            name: "whois",
            type: 2
        });
    }

    public async exec(interaction: ContextMenuInteraction) {
        const member = interaction.options.getMember('user') as GuildMember;
        if (!member) {
            await interaction.reply({
                embeds: [
                    {
                        description: "I couldn't find a user sowwy!"
                    }
                ]
            })
            return
        }
        const embed = new MessageEmbed()
            .setAuthor(member.displayName, member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(member.roles.highest.color)
            .addFields([
                {
                    name: "Joined Timestamp",
                    value: `<t:${Math.round( member.joinedTimestamp! / 1000 )}:f>`,
                    inline: true
                },
                {
                    name: "Account created",
                    value: `<t:${Math.round( member.user.createdTimestamp / 1000 )}:f>`,
                    inline: true
                },
                {
                    name: "Badges",
                    value: `${(this.badges(member.user) || "No badges")}`
                },
                {
                    name: "Highest role!",
                    value: `${member.roles.highest.name} - [${member.roles.highest.position}]`,
                    inline: true
                },
                {
                    name: "Bot",
                    value: `${member.user.bot ? "yep" : "nope"}`,
                    inline: true
                },
                {
                    name: "Roles",
                    value: `${this.trimRole(member.roles) ?? "No roles"}`
                }
            ])

        await interaction.reply({
            embeds: [embed]
        })
        return
    }
    trimRole(roles: GuildMemberRoleManager) {
       const roleNumber = roles.cache.size
       if (roleNumber > 20) {
           const rolesArray = [...roles.cache.keys()].slice(0, 20)
           return rolesArray.map(role => `<@&${role}>`).join(' ')
       }
       else {
           return roles.cache.map(role => `<@&${role.id}>`).join(' ')
       }
    }
    badges(user: User) {
        let string = "";
        if (Number(user.flags) & 1 << 0) string += "<:discord_employee:888346725071351860> "
        if (Number(user.flags) & 1 << 1) string += "<:partner_server_owner:888347707595436083> "
        if (Number(user.flags) & 1 << 2) string += "<:hype_events:888348432090169344> "
        if (Number(user.flags) & 1 << 3) string += "<:bug_1:888348701452541962> "
        if (Number(user.flags) & 1 << 6) string += "<:bravery:888348973260230677> "
        if (Number(user.flags) & 1 << 7) string += "<:brilliance:888349815069610014> "
        if (Number(user.flags) & 1 << 8) string += "<:balance:888350546250072066> "
        if (Number(user.flags) & 1 << 9) string += "<:early_supporter:888436701003911168> "
        // if (Number(user.flags) & 1 << 10)
        if (Number(user.flags) & 1 << 14) string += "<:bug_1:888348701452541962> "
        if (Number(user.flags) & 1 << 16) string += "<:verified:888438391828541461> "
        if(Number(user.flags) & 1 << 17) string += "<:code:831149878456483841> "
        if (Number(user.flags) & 1 << 18) string += "<:mod:888439129799549038>"
        return string.trim()
    }
}

export default whoisInteraction;
