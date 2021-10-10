import Event from "../../struct/Event";
import { Guild } from "discord.js";

abstract class GuildMemberAddEvent extends Event {
  protected constructor() {
    super({
      name: "guildCreate",
    });
  }

  public async exec(server: Guild): Promise<void> {
    await this.client.prisma.server.upsert(
        {
          where: {
            id: BigInt(server.id)
          },
          create: {
            id: BigInt(server.id)
          },
          update: {
            id: BigInt(server.id)
          }
        }
    );
    console.log(`I have Joined a Guild and created its data in database`);
  }
}

export default GuildMemberAddEvent;
