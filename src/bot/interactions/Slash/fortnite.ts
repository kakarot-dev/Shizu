/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-case-declarations */
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageEmbed,
} from "discord.js";
import Interaction from "../../struct/Interaction";

abstract class FortniteInteraction extends Interaction {
  constructor() {
    super({
      name: "fortnite",
      description: "Recieve Fortnite stats",
      cooldown: 30,
      options: [
        {
          type: 3,
          name: "platform",
          description: "Platform to let the api search",
          required: true,
          choices: [
            {
              name: "Personal Computer",
              value: "pc",
            },
            {
              name: "XBox Live",
              value: "xbl",
            },
            {
              name: "Playstation Network",
              value: "psn",
            },
          ],
        },
        {
          type: 3,
          name: "player_name",
          description: "Specify the player to search",
          required: true,
        },
      ],
    });
  }

  public async exec(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const arg = args.getString("platform") as string;
    const player = args.getString("player_name") as string;
    switch (arg) {
      case "pc":
        const datapc = await this.client.fortnite.user(`${player}`, "pc");
        const embedpc = new MessageEmbed()
          .setTitle(`Fortnite Stats for ${datapc.username}`)
          .setURL(datapc.url)
          .setDescription(
            String(`
                    **ID**: ${datapc.id},
                    **Platform**: ${datapc.platform}
                    `)
          )
          .addField(
            "Solo Stats",
            String(`
							** Score **: ${datapc.stats.solo.score}
							** KD **: ${datapc.stats.solo.kd}
							** Matches **: ${datapc.stats.solo.matches}
							** Kills **: ${datapc.stats.solo.kills}
							** Kills per match **: ${datapc.stats.solo.kills_per_match}
							** Score per match **: ${datapc.stats.solo.score_per_match}
							** Solo wins **: ${datapc.stats.solo.wins}
					`),
            true
          )
          .addField(
            "Duo Stats",
            String(`
							**Score**: ${datapc.stats.duo.score}
							**KD**: ${datapc.stats.duo.kd}
							**Matches**: ${datapc.stats.duo.matches}
							**Kills**: ${datapc.stats.duo.kills}
							**Kills per match**: ${datapc.stats.duo.kills_per_match}
							**Score per match**: ${datapc.stats.duo.score_per_match}
							**Duo wins**: ${datapc.stats.duo.wins}
						`),
            true
          )
          .addField(
            "Squad Stats",
            String(`
							**Score**: ${datapc.stats.squad.score}
							**KD**: ${datapc.stats.squad.kd}
							**Matches**: ${datapc.stats.squad.matches}
							**Kills**: ${datapc.stats.squad.kills}
							**Kills per match**: ${datapc.stats.squad.kills_per_match}
							**Score per match**: ${datapc.stats.squad.score_per_match}
							**Squads wins**: ${datapc.stats.squad.wins}
						`),
            true
          )
          .setColor("RED")
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/831552576180322305/839136865784299590/cbb5febc1b7dd0543fdec10cf3d28b57c101f779r1-2048-1152v2_uhq.png"
          )
          .setImage(
            "https://cdn.discordapp.com/attachments/831552576180322305/839137663193710642/14br-consoles-1920x1080-wlogo-1920x1080-432974386.png"
          );
        await interaction.reply({
          embeds: [embedpc],
        });
        break;
      case "xbl":
        const dataxbl = await this.client.fortnite.user(`${player}`, "xbl");
        const embedxbl = new MessageEmbed()
          .setTitle(`Fortnite Stats for ${dataxbl.username}`)
          .setURL(dataxbl.url)
          .setDescription(
            `
                **ID**: ${dataxbl.id},
                **Platform**: ${dataxbl.platform}
                `
          )
          .addField(
            "Solo Stats",
            String(`
							**Score**: ${dataxbl.stats.solo.score}
							**KD**: ${dataxbl.stats.solo.kd}
							**Matches**: ${dataxbl.stats.solo.matches}
							**Kills**: ${dataxbl.stats.solo.kills}
							**Kills per match**: ${dataxbl.stats.solo.kills_per_match}
							**Score per match**: ${dataxbl.stats.solo.score_per_match}
							**Solo wins**: ${dataxbl.stats.solo.wins}
						`),
            true
          )
          .addField(
            "Duo Stats",
            String(`
							**Score**: ${dataxbl.stats.duo.score}
							**KD**: ${dataxbl.stats.duo.kd}
							**Matches**: ${dataxbl.stats.duo.matches}
							**Kills**: ${dataxbl.stats.duo.kills}
							**Kills per match**: ${dataxbl.stats.duo.kills_per_match}
							**Score per match**: ${dataxbl.stats.duo.score_per_match}
							**Duo wins**: ${dataxbl.stats.duo.wins}
						`),
            true
          )
          .addField(
            "Squad Stats",
            String(`
							**Score**: ${dataxbl.stats.squad.score}
							**KD**: ${dataxbl.stats.squad.kd}
							**Matches**: ${dataxbl.stats.squad.matches}
							**Kills**: ${dataxbl.stats.squad.kills}
							**Kills per match**: ${dataxbl.stats.squad.kills_per_match}
							**Score per match**: ${dataxbl.stats.squad.score_per_match}
							**Squads wins**: ${dataxbl.stats.squad.wins}
						`),
            true
          )
          .setColor("RED")
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/831552576180322305/839136865784299590/cbb5febc1b7dd0543fdec10cf3d28b57c101f779r1-2048-1152v2_uhq.png"
          )
          .setImage(
            "https://cdn.discordapp.com/attachments/831552576180322305/839137663193710642/14br-consoles-1920x1080-wlogo-1920x1080-432974386.png"
          );
        await interaction.reply({
          embeds: [embedxbl],
        });
        break;
      case "psn":
        const datapsn = await this.client.fortnite.user(`${player}`, "psn");
        const embedpsn = new MessageEmbed()
          .setTitle(`Fortnite Stats for ${datapsn.username}`)
          .setURL(datapsn.url)
          .setDescription(
            `
            **ID**: ${datapsn.id},
            **Platform**: ${datapsn.platform}
            `
          )
          .addField(
            "Solo Stats",
            String(`
							**Score**: ${datapsn.stats.solo.score}
							**KD**: ${datapsn.stats.solo.kd}
							**Matches**: ${datapsn.stats.solo.matches}
							**Kills**: ${datapsn.stats.solo.kills}
							**Kills per match**: ${datapsn.stats.solo.kills_per_match}
							**Score per match**: ${datapsn.stats.solo.score_per_match}
							**Solo wins**: ${datapsn.stats.solo.wins}
						`),
            true
          )
          .addField(
            "Duo Stats",
            String(`
							**Score**: ${datapsn.stats.duo.score}
							**KD**: ${datapsn.stats.duo.kd}
							**Matches**: ${datapsn.stats.duo.matches}
							**Kills**: ${datapsn.stats.duo.kills}
							**Kills per match**: ${datapsn.stats.duo.kills_per_match}
							**Score per match**: ${datapsn.stats.duo.score_per_match}
							**Duo wins**: ${datapsn.stats.duo.wins}
						`),
            true
          )
          .addField(
            "Squad Stats",
            String(`
							**Score**: ${datapsn.stats.squad.score}
							**KD**: ${datapsn.stats.squad.kd}
							**Matches**: ${datapsn.stats.squad.matches}
							*Kills**: ${datapsn.stats.squad.kills}
							**Kills per match**: ${datapsn.stats.squad.kills_per_match}
							**Score per match**: ${datapsn.stats.squad.score_per_match}
							**Squads wins**: ${datapsn.stats.squad.wins}
						`),
            true
          )
          .setColor("RED")
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/831552576180322305/839136865784299590/cbb5febc1b7dd0543fdec10cf3d28b57c101f779r1-2048-1152v2_uhq.png"
          )
          .setImage(
            "https://cdn.discordapp.com/attachments/831552576180322305/839137663193710642/14br-consoles-1920x1080-wlogo-1920x1080-432974386.png"
          );
        await interaction.reply({
          embeds: [embedpsn],
        });
        break;
    }
  }
}

export default FortniteInteraction;
