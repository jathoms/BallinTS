import { ButtonInteraction, MessageEmbed } from "discord.js";
import remove_player from "../handler_util/remove_player";
import handle_deletion_response from "../handler_util/player_remove_response_handler";
import update_embed from "../handler_util/update_embed";

module.exports = {
  data: { name: "leaveButton" },
  async execute(interaction: ButtonInteraction) {
    const [response, newEmbed] = await remove_player(
      interaction.message.embeds[0] as MessageEmbed,
      interaction.user.id
    );
    if (response === "success") {
      update_embed(interaction, newEmbed);
    }
    const userResponse = handle_deletion_response(response);
    interaction.channel?.send(`${interaction.user.username} fears...`);
    await interaction.reply({
      content: userResponse,
      ephemeral: true,
    });
  },
};
