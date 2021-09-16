/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GuildMember } from 'discord.js';
import Event from '../../struct/Event';
import { modadd } from '../../api/modEmbeds'
import { log } from '../../api/mod-webhooks';

abstract class ModGuildMemberAddEvent extends Event {
    protected constructor() {
        super({
            name: 'guildMemberAdd',
        });
    }

    public async exec(member: GuildMember) {        
            const hook = await log(member.guild, this.client);
            if (!hook) return;
            await modadd(member, hook);
        }
    }

export default ModGuildMemberAddEvent;
