/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageEmbed,
} from "discord.js";
import Interaction from "../../struct/Interaction";
import axios from "axios";

abstract class NpmInteraction extends Interaction {
  protected constructor() {
    super({
      name: "npm",
      description: "Searches for packages",
      options: [
        {
          type: "STRING",
          name: "package-name",
          description:
            "The package name u want to search for in https://npmjs.com",
          required: true,
        },
      ],
    });
  }

  public async exec(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    let response;
    const search = args.getString("package-name") as string;
    response = await axios
      .get(`https://api.npms.io/v2/search?q=${search}`)
      .then((res) => res.data); // Search the package
    const pkg = response.results[0].package;
    const alpha = pkg.author ? pkg.author.name : "None";
    const npme = new MessageEmbed()
      .setColor("RANDOM")
      .setTimestamp()
      .setTitle(pkg.name)
      .setURL(pkg.links.npm)
      .setDescription(
        pkg.description ? pkg.description : "No Description Provided"
      )
      .addField("**❯ Alpha:**", String(`${alpha}`), true)
      .addField("**❯ Version:**", String(pkg.version), true)
      .addField(
        "**❯ Repo:**",
        String(
          pkg.links.repository
            ? `[Click Repo](${pkg.links.repository})`
            : "[Nothing](https://github.com)"
        ),
        true
      )
      .addField(
        "**❯ Homepage:**",
        String(
          pkg.links.homepage
            ? `[Click Home](${pkg.links.homepage})`
            : "[Nothing](https://github.com)"
        ),
        true
      )
      .addField(
        "**❯ Scope:**",
        String(pkg.scope ? pkg.scope : "I have No scope"),
        true
      )
      .addField(
        "**❯ Maintainers:**",
        String(
          pkg.maintainers
            ? pkg.maintainers.map((e) => e.username).join(" | ")
            : "No maintainers"
        )
      )
      .addField(
        "**❯ KeyWords:**",
        String(pkg.keywords ? pkg.keywords.join(" | ") : "No Key words Found")
      );
    await interaction.reply({ embeds: [npme] });
  }
}

export default NpmInteraction;
