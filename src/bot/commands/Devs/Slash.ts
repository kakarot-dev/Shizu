import { InteractionRegistry } from "../../api/registries/export/RegistryIndex";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Command from "../../struct/Command";
import { Message } from "discord.js";
abstract class SlashCommand extends Command {
  protected constructor() {
    super({
      name: "slash",
      aliases: [],
      description: "Register Slash Commands",
      usage: "<prefix>slash",
      category: "Devs",
      cooldown: 2,
      ownerOnly: true,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  public async exec(message: Message) {
    InteractionRegistry(this.client);
    message.channel.send({
      content: `Started registering the slash commands`,
    });
  }
}
export default SlashCommand;
