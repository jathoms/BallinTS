import { ButtonInteraction } from "discord.js";
module.exports = {
  data: { name: "readyButton" },
  async execute(interaction: ButtonInteraction) {
    const response = "Ready!";

    await interaction.reply({
      content: response,
      ephemeral: true,
    });
  },
};
