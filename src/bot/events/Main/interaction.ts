/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Interaction, Collection, MessageEmbed } from "discord.js";
import Event from "../../struct/Event";

abstract class InteractionEvent extends Event {
  constructor() {
    super({
      name: "interactionCreate",
    });
  }

  public async exec(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = this.client.interactions.get(interaction.commandName);
      if (command?.cooldown) {
        if (!this.client.cooldowns.has(command.name)) {
          this.client.cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = this.client.cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (timestamps?.has(interaction.user.id)) {
          const cooldown = timestamps.get(interaction.user.id);
          if (cooldown) {
            const expirationTime = cooldown + cooldownAmount;
            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              interaction.reply(
                `Wait ${timeLeft.toFixed(
                  1
                )} more second(s) before reusing the \`${
                  command.name
                }\` command.`
              );
              return;
            }
          }
        }
        timestamps?.set(interaction.user.id, now);
        setTimeout(
          () => timestamps?.delete(interaction.user.id),
          cooldownAmount
        );
      }
      if (command?.exec.constructor.name === "AsyncFunction") {
        command.exec(interaction, interaction.options).catch((err) => {
          const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(err.message)
            .setTitle("Error Message");
          console.log(err);
          interaction.reply({
            embeds: [errEmbed],
            ephemeral: true,
          });
        });
        return;
      } else {
        try {
          command?.exec(interaction, interaction.options);
          return;
        } catch (err: any) {
          const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(err.message)
            .setTitle("Error Message");
          console.log(err);
          interaction.reply({
            embeds: [errEmbed],
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton()) {
      const button = this.client.buttons.get(interaction.customId);
      if (!button) {
        // interaction.reply({
        // 	content: 'Couldnt Find the Button in Cache',
        // 	ephemeral: true
        // })
        return;
      }
      button.exec(interaction).catch((err) => {
        console.log(err);
        return interaction.reply(`${err.message}`);
      });
    }
    return;
  }
}

export default InteractionEvent;
