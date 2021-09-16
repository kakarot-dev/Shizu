/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DMChannel, GuildChannel } from "discord.js";
import Event from "../../struct/Event";
import { modchandel } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class ModChannelDeleteEvent extends Event {
  protected constructor() {
    super({
      name: "channelDelete",
    });
  }

  public async exec(channel: GuildChannel | DMChannel) {
    if (channel instanceof DMChannel) return;
    if (channel.guild !== null) {
      const hook = await log(channel.guild, this.client);
      if (!hook) return;
      await modchandel(channel, hook);
    } else return;
  }
}

export default ModChannelDeleteEvent;
