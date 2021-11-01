import Event from "../../struct/Event";
import { Guild } from "discord.js";

abstract class GuildMemberAddEvent extends Event {
  protected constructor() {
    super({
      name: "guildDelete",
    });
  }

  public async exec(server: Guild): Promise<void> {
    // await guild.findOneAndDelete({
    //   guildId: server.id,
    // });
    if (!this.client.isReady()) return
    await this.client.prisma.afk.deleteMany({
      where: {
        id: BigInt(server.id)
      }
    });
    await this.client.prisma.mutes.deleteMany({
      where: {
        id: BigInt(server.id)
      }
    });
    console.log(
      `I was removed from a Guild and I have now deleted its data from the database`
    );
  }
}

export default GuildMemberAddEvent;
