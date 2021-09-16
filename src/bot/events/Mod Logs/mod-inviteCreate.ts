/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Guild, Invite } from "discord.js";
import Event from "../../struct/Event";
import { modinvcre } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class ModInviteCreateEvent extends Event {
  protected constructor() {
    super({
      name: "inviteCreate",
    });
  }

  public async exec(invite: Invite) {
    if (!invite.guild) return;
    const hook = await log(invite.guild as Guild, this.client);
    if (!hook) return;
    await modinvcre(invite, hook);
  }
}

export default ModInviteCreateEvent;
