import { ButtonInteraction } from "discord.js";
import Bot from "../api/Client";
import { ButtonType } from "../types/Options";

abstract class ButtonCommand {
  public name: string;
  public once: boolean;
  public path: string;
  public abstract client: Bot;

  protected constructor(options: ButtonType) {
    this.name = options.name;
    this.once = options.once ?? false;
  }

  public abstract exec(interactions: ButtonInteraction): Promise<void>;
}

export default ButtonCommand;
