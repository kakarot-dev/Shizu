/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GuildMember } from "discord.js";
import Event from "../../struct/Event";
import { mute } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class MuteModEvent extends Event {
  protected constructor() {
    super({
      name: "muted",
    });
  }

  public async exec(member: GuildMember, staffMember: GuildMember, reason: string) {
      const hook = await log(member.guild, this.client);
      if (!hook) return;
      await mute(member, hook, staffMember, reason);
  }
}

export default MuteModEvent;
