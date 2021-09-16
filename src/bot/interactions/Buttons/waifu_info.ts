/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    ButtonInteraction,
} from "discord.js";
import Button from "../../struct/Button";

abstract class Waifu extends Button {
    protected constructor() {
        super({
            name: "WAIFU_INFO",
        });
    }

    public async exec(interaction: ButtonInteraction) {
        await interaction.reply({
            embeds: [this.client.waifu.InfoEmbed],
            ephemeral: true
        });
    }
}

export default Waifu;
