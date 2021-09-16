/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GuildMember } from "discord.js";
import Event from "../../struct/Event";
import { ban } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class BanEvent extends Event {
  protected constructor() {
    super({
      name: "banned",
    });
  }

  public async exec(member: GuildMember, staffMember: GuildMember, reason: string) {
      const hook = await log(member.guild, this.client);
      if (!hook) return;
      await ban(member, hook, staffMember, reason);
  }
}

export default BanEvent;
