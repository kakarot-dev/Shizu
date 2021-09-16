/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Sticker } from "discord.js";
import Event from "../../struct/Event";
import { stickerEdit } from "../../api/modEmbeds";
import { log } from "../../api/mod-webhooks";

abstract class StickerUpdateModEvent extends Event {
    protected constructor() {
        super({
            name: "stickerUpdate",
        });
    }

    public async exec(sticker: Sticker) {
        const hook = await log(sticker.guild!, this.client);
        if (!hook) return;
        await stickerEdit(hook, sticker);
    }
}

export default StickerUpdateModEvent;