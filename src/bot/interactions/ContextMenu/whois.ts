/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
   ContextMenuInteraction
} from "discord.js";
import Menu from "../../struct/Menu";

abstract class testInteraction extends Menu {
    protected constructor() {
        super({
            name: "test",
            type: 1
        });
    }

    public async exec(interaction: ContextMenuInteraction) {
        console.log(interaction)
    }
}

export default testInteraction;
