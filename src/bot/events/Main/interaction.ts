/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Interaction, Collection, MessageEmbed } from "discord.js";
import Event from "../../struct/Event";

abstract class InteractionEvent extends Event {
  protected constructor() {
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
              await interaction.reply(
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
        command?.exec(interaction, interaction.options).catch(async (err) => {
          const id = this.client.rollbar.error(err)
          const errEmbed = new MessageEmbed()
            .setColor("RED")
          errEmbed.setDescription(err.message + "\n\n" + `Report the problem with the id: \`${id.uuid}\``);
          errEmbed.setTitle("Error Message");
          await interaction.reply({
            embeds: [errEmbed],
          });
        });
        return;
    } else if (interaction.isButton()) {
      const button = this.client.buttons.get(interaction.customId);
      if (!button) {
        // interaction.reply({
        // 	content: 'Couldnt Find the Button in Cache',
        // 	ephemeral: true
        // })
        return;
      }
      button.exec(interaction).catch(async (err) => {
        const id = this.client.rollbar.error(err)
        const errEmbed = new MessageEmbed()
            .setColor("RED")
        errEmbed.setDescription(err.message + "\n\n" + `Report the problem with the id: \`${id.uuid}\``);
        errEmbed.setTitle("Error Message");
        await interaction.reply({
          embeds: [errEmbed],
        });
      });
    } else if (interaction.isContextMenu()) {
      const menu = this.client.menus.get(interaction.commandName);
      if (!menu) {
        return
      }
      menu.exec(interaction).catch(async (err) => {
        const id = this.client.rollbar.error(err)
        const errEmbed = new MessageEmbed()
            .setColor("RED")
        errEmbed.setDescription(err.message + "\n\n" + `Report the problem with the id: \`${id.uuid}\``);
        errEmbed.setTitle("Error Message");
        await interaction.reply({
          embeds: [errEmbed],
        });
      });
    }
    return;
  }
}

export default InteractionEvent;
