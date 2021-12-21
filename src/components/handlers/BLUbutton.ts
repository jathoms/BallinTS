import { ButtonInteraction } from "discord.js";
import join_button_execute from "../handler_util/join_button_execute";
import Team from "../../util/teams";

module.exports = {
  data: { name: "BLUbutton" },
  async execute(interaction: ButtonInteraction) {
    const team = new Team("BLU");
    const response = await join_button_execute(interaction, team);
    await interaction.reply({
      content: response,
      ephemeral: true,
    });
  },
};
