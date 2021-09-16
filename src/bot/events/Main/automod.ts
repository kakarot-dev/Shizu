/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Event from "../../struct/Event";
import { Message } from "discord.js";
import antiLine from '../../api/automod/newLine';
import antiMention from '../../api/automod/massMention';
import link from '../../api/automod/Links';

abstract class MessageEvent extends Event {
    protected constructor() {
        super({
            name: "messageCreate",
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public async exec(message: Message) {
        let returned = 0;
        if (!message.guild || message.guild?.id !== "740545693118234664" || message.author.bot || !message.member) return;

        const data = this.client.cache.getData(message.guild.id);
        if (!data || !data.autoMod || !data.autoMod.enabled) return;

        if (!message.guild.me?.permissions.has("MANAGE_MESSAGES") || !message.guild.me.permissions.has("KICK_MEMBERS") || !message.guild.me.permissions.has("MANAGE_ROLES")) return;
        const ignoredRoles = data.autoMod.ignoredRoles ? data.autoMod.ignoredRoles : [];
        const modRoles = data.modRoles ? data.modRoles : [];
        const userRoles = [...message.member.roles.cache.keys()];
        const hasModRoles = modRoles.some(id => userRoles.includes(id));
        const hasIgnoredRoles = ignoredRoles.some(id => userRoles.includes(id))
        if (hasModRoles || hasIgnoredRoles) return;
        // TODO: CHANGE THE NULL ASSERTION
        if (!message.member?.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_GUILD")) return;

        if (data.autoMod.newLineThreshold) returned = await antiLine(message, this.client, data.autoMod.newLineThreshold, data.autoMod.punishments!.antiNewLine as string)
        if (returned) return;
        if (data.autoMod.massMentionThreshold) returned = await antiMention(message, this.client, data.autoMod.massMentionThreshold, data.autoMod.punishments!.massMention as string)
        if (returned) return;
        if (data.autoMod.linkAutoMod.enabled) returned = await link(message, this.client, data.autoMod.linkAutoMod.whiteListedLinks, data.autoMod.punishments!.antiLink as string)
    }
}

export default MessageEvent;