import {
  ApplicationCommandOptionData,
  CommandInteractionOptionResolver,
  Interaction,
} from "discord.js";
import Bot from "../api/Client";
import { InteractionType } from "../types/Options";

abstract class InteractionCommand {
  public name: string;
  public description: string;
  public cooldown: number;
  public path: string;
  public options: ApplicationCommandOptionData[] | undefined;
  public abstract client: Bot;

  protected constructor(options: InteractionType) {
    this.name = options.name;
    this.description = options.description ?? "";
    this.cooldown = options.cooldown ?? 0;
    this.options = options.options;
  }

  public abstract exec(
    interactions: Interaction,
    args: CommandInteractionOptionResolver
  ): Promise<void>;
}

export default InteractionCommand;
