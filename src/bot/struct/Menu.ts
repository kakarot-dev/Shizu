import { ContextMenuInteraction } from "discord.js";
import Bot from "../api/Client";
import { MenuType } from "../types/Options";

abstract class MenuCommand {
    public name: string;
    public type: number;
    public path: string
    public abstract client: Bot;

    protected constructor(options: MenuType) {
        this.name = options.name;
        this.type = options.type;
    }

    public abstract exec(interaction: ContextMenuInteraction): Promise<void>;
}

export default MenuCommand;
