import Event from "../../struct/Event";
import { Guild } from "discord.js";
import { guild } from "../../mongoose/schemas/guild";
abstract class GuildMemberAddEvent extends Event {
  constructor() {
    super({
      name: "guildCreate",
    });
  }

  public async exec(server: Guild): Promise<void> {
    await guild.findOneAndUpdate(
      {
        guildId: server.id,
      },
      {
        guildId: server.id,
      },
      {
        upsert: true,
      }
    );
    console.log(`I have Joined a Guild and created its data in database`);
  }
}

export default GuildMemberAddEvent;
