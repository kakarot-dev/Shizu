/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Client, Collection, Intents, Options, Guild, ClientUser} from "discord.js";
import {
  CommandRegistry,
  EventRegistry,
} from "./registries/export/RegistryIndex";
import {
  ButtonOptions,
  CommandOptions,
  EventOptions,
  InteractionCommandOptions,
  MenuOptions
} from "../types/Options";
import { PrismaClient } from '@prisma/client';
import Kitsu from "../struct/Kitsu/Kitsu";
import Ft from "fortnite";
import { Anischedule } from "../struct/AniSchedule";
import { waifu } from "../struct/waifu";
import { Cache } from "../struct/Cache";
import Rollbar from 'rollbar';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const emojis = require('../../../emojis.json')

class Bot extends Client {
  public defaultprefix: string;
  public prisma: PrismaClient = new PrismaClient();
  public commands = new Collection<string, CommandOptions>();
  public interactions = new Collection<string, InteractionCommandOptions>();
  public cooldowns = new Collection<string, Collection<string, number>>();
  public events = new Collection<string, EventOptions>();
  static emoji = emojis
  public buttons = new Collection<string, ButtonOptions>();
  public menus = new Collection<string, MenuOptions>();
  public cache = new Cache(this);
  public kitsu = new Kitsu();
  public fortnite = new Ft(process.env.FORTTOKEN ?? "test");
  public anischedule = new Anischedule(this);
  public waifu = new waifu(this);
  declare user: ClientUser
  public rollbar: Rollbar;
  public constructor() {
    super({
      /* Discord JS Client Options */
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
      ],
      makeCache: Options.cacheWithLimits({
        MessageManager: 100, // This is default.
        UserManager: 10000,
        GuildMemberManager: 3000,
        PresenceManager: 0,
      }),
      partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
      messageCacheLifetime: 700,
    });

    this.defaultprefix = process.env.PREFIX ?? "sh.";
  }
  public async prismaData() {
    this.prisma.$connect()
        .then(() => console.log("Cockroach db is connected"))
        .catch(err => console.error(err))
  }
  public async start() {
    await this.prismaData()
    CommandRegistry(this);
    EventRegistry(this);
    await super.login(process.env.TOKEN);
  }
  public loop(
    fn: { (): Promise<void>; (): void; (...args: any[]): void },
    delay: number | undefined,
    ...param: undefined[]
  ) {
     fn();
    return setInterval(fn, delay, ...param);
  }
  public async registerGuilds(): Promise<string> {
      this.guilds.cache.forEach(async (server: Guild) => {
        await this.prisma.guild.create({
          data: {
            id: BigInt(server.id)
          }
        }).catch(() => null)
      })
      return `I have saved a total of ${this.guilds.cache.size} guilds in the db`;
  }
}

export default Bot;
