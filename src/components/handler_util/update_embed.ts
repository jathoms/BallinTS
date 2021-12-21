import { createActionRow } from "../lobby_interaction_row";
import { ButtonInteraction, MessageEmbed } from "discord.js";

export default (
  interaction: ButtonInteraction,
  newEmbed: MessageEmbed,
  isFull: boolean = false
) => {
  interaction.webhook.editMessage(interaction.message.id, {
    embeds: [newEmbed],
    components: [createActionRow(isFull)],
  });
};
