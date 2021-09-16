/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Sticker } from "discord.js";
import Event from "../../struct/Event";
import { stickerCreate } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class StickerCreateModEvent extends Event {
    protected constructor() {
    super({
      name: "stickerCreate",
    });
  }

  public async exec(sticker: Sticker) {
      const hook = await log(sticker.guild!, this.client);
      if (!hook) return;
      await stickerCreate(hook, sticker);
  }
}

export default StickerCreateModEvent;