/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Event from "../../struct/Event";
import { GuildMember } from "discord.js";
abstract class GuildMemberAddEvent extends Event {
  protected constructor() {
    super({
      name: "guildMemberAdd",
    });
  }

  public async exec(member: GuildMember) {
    if (member.user.bot) return;
    const { guild } = member;

    const data = await this.client.prisma.mutes.findMany({
      where: {
        id: BigInt(member.user.id),
        guildId: String(guild.id)
      }
    }).catch(() => null)

    if (!data || !data.length) return;
    const role = await this.client.cache.muterole(guild);
    if (!role) return;
    await member.roles.add(role?.id).catch(() => null);
  }
}

export default GuildMemberAddEvent;

