/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GuildMember } from "discord.js";
import Event from "../../struct/Event";
import { unmute } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class UnMuteModEvent extends Event {
  protected constructor() {
    super({
      name: "unmuted",
    });
  }

  public async exec(member: GuildMember,  reason: string) {
      const hook = await log(member.guild, this.client);
      if (!hook) return;
      await unmute(member, hook, reason);
  }
}

export default UnMuteModEvent;
