/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message } from "discord.js";
import Event from "../../struct/Event";
import { modmsgedit } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class ModMessageUpdateEvent extends Event {
  protected constructor() {
    super({
      name: "messageUpdate",
    });
  }

  public async exec(oldmsg: Message, newmsg: Message) {
    if (!oldmsg.author || !newmsg.author) return;
    if (oldmsg.author.bot) return;
    if (oldmsg.content === newmsg.content) return;
    if (!oldmsg.guild) return;
    const hook = await log(oldmsg.guild, this.client);
    if (!hook) return;
    await modmsgedit(oldmsg, newmsg, hook);
  }
}

export default ModMessageUpdateEvent;
