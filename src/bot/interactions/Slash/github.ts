/* eslint-disable no-case-declarations */
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageEmbed,
} from "discord.js";
import Interaction from "../../struct/Interaction";
import axios from "axios";
import { utc } from "moment";

abstract class GithubInteraction extends Interaction {
  protected constructor() {
    super({
      name: "github",
      description: "Search github for repo/users",
      cooldown: 9,
      options: [
        {
          type: 3,
          name: "repo_or_user",
          description: "Tell if u want to search for a repo or a github user",
          required: true,
          choices: [
            {
              name: "repo",
              value: "repo",
            },
            {
              name: "user",
              value: "user",
            },
          ],
        },
        {
          type: 3,
          name: "target_name",
          description: "Tell the name",
          required: true,
        },
      ],
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async exec(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const repooruser = args.getString("repo_or_user") as string;
    const target = args.getString("target_name") as string;
    switch (repooruser) {
      case "user":
        const git = await axios
          .get(`https://api.github.com/users/${target}`)
          .then((res) => res.data);
        if (git.message) {
          interaction.reply({
            content:
              "<:tick_no:835440115706888195> Sorry!!!!! No results Found",
          });
          return;
        }
        const ghe = new MessageEmbed()
          .setTitle(git.login)
          .setThumbnail(git.avatar_url)
          .setURL(git.html_url)
          .setDescription(git.bio ? git.bio : "No Bio Given")
          .setFooter(git.company ? git.company : "No Companies Registered")
          .setTimestamp()
          .addField("**❯ ID: **", String(`${git.id}`), true)
          .addField(
            "**❯ Site Admin: **",
            String(git.site_admin ? "Github Admin" : "Github User"),
            true
          )
          .addField(
            "**❯ Hireable: **",
            String(git.hireable ? `[Hire](${git.html_url})` : "NOT AVAILABLE"),
            true
          )
          .addField("**❯ Public Repos: **", String(`${git.public_repos}`), true)
          .addField("**❯ Public Gists: **", String(`${git.public_gists}`), true)
          .addField("**❯ Followers: **", String(`${git.followers}`), true)
          .addField("**❯ Following: **", String(`${git.following}`), true)
          .addField(
            "**❯ Twitter: **",
            String(
              git.twitter_username
                ? `${git.twitter_username}`
                : "No twitter Username"
            ),
            true
          );
        interaction.reply({
          embeds: [ghe],
        });
        break;
      case "repo":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rep: any = await axios
          .get(`https://api.github.com/search/repositories?q=${target}`)
          .then((res) => res.data);
        if (rep.message) {
          interaction.editReply(
            " <:tick_no:835440115706888195> Sorry!!!!! No results Found"
          );
          return;
        }
        const repo = rep.items[0];
        const gue = new MessageEmbed()
          .setTitle(repo.name)
          .setURL(repo.html_url)
          .setDescription(
            repo.description ? repo.description : "No description"
          )
          .addField(
            "❯ License",
            String(repo.license ? `${repo.license.name}` : "No License"),
            true
          )
          .addField(
            "❯ Forked?",
            String(
              repo.fork ? "This is a fork" : "Nope, this ia the original one"
            ),
            true
          )
          .addField(
            "❯ Created At",
            String(`${utc(repo.created_at).format("Do MMMM YYYY HH:mm:ss")}`),
            true
          )
          .addField(
            "❯ Updated At",
            String(
              repo.updated_at
                ? `${utc(repo.updated_at).format("Do MMMM YYYY HH:mm:ss")}`
                : "No updates pushed"
            ),
            true
          )
          .addField("❯ Stars", String(`${repo.stargazers_count}`), true)
          .addField("❯ Watchers", String(`${repo.watchers_count}`), true)
          .addField("❯ Language", String(repo.language), true)
          .addField("❯ Issues", String(`${repo.open_issues}`), true)
          .addField("❯ Forks", String(`${repo.forks}`), true)
          .setAuthor(
            repo.owner ? repo.owner.login : "No author",
            repo.owner ? repo.owner.avatar_url : null,
            repo.owner ? repo.owner.html_url : "https://github.com"
          );
        interaction.reply({
          embeds: [gue],
        });
        break;
    }
  }
}

export default GithubInteraction;
