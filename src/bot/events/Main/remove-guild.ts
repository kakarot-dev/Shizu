import Event from "../../struct/Event";
import { Guild } from "discord.js";
//import { guild } from "../../mongoose/schemas/guild";
import { watchList } from "../../mongoose/schemas/GuildWatchList";
import { afk } from "../../mongoose/schemas/afk";
import { mute_Schema as MuteSchema } from "../../mongoose/schemas/mute";
import { Schedule_Schema as scheduledSchema } from "../../mongoose/schemas/schedule";

abstract class GuildMemberAddEvent extends Event {
  constructor() {
    super({
      name: "guildDelete",
    });
  }

  public async exec(server: Guild): Promise<void> {
    // await guild.findOneAndDelete({
    //   guildId: server.id,
    // });
    await watchList.findOneAndDelete({
      guildId: server.id,
    });
    await afk.deleteMany({
      guildId: server.id,
    });
    await MuteSchema.deleteMany({
      guildId: server.id,
    });
    await scheduledSchema.deleteMany({
      guildId: server.id,
    });
    console.log(
      `I was removed from a Guild and I have now deleted its data from the database`
    );
  }
}

export default GuildMemberAddEvent;
