/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GuildMember } from "discord.js";
import Event from "../../struct/Event";
import { kick } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class KickEvent extends Event {
  constructor() {
    super({
      name: "kicked",
    });
  }

  public async exec(member: GuildMember, staffMember: GuildMember, reason: string) {
      const hook = await log(member.guild, this.client);
      if (!hook) return;
      await kick(member, hook, staffMember, reason);
  }
}

export default KickEvent;
