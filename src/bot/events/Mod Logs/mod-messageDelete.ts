/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message } from "discord.js";
import Event from "../../struct/Event";
import { modmsgdel } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class ModMessageDeleteEvent extends Event {
  protected constructor() {
    super({
      name: "messageDelete",
    });
  }

  public async exec(msg: Message) {
    if (!msg.content) return;
    if (!msg.guild) return;
    const hook = await log(msg.guild, this.client);
    if (!hook) return;
    await modmsgdel(msg, hook);
  }
}

export default ModMessageDeleteEvent;
