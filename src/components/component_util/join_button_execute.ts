import { ButtonInteraction, MessageEmbed } from "discord.js";
import Team from "../../util/teams";
import add_player from "./add_player";
import remove_player from "./remove_player";
import handle_response from "./player_add_response_handler";

export default async (interaction: ButtonInteraction, team: Team) => {
  let add_button_response = add_player(interaction, team);

  if (add_button_response === "switch") {
    let [deletion_response, embed_deleted_player] = await remove_player(
      interaction.message.embeds[0] as MessageEmbed,
      interaction.user.id
    );
    if (deletion_response === "success") {
      add_button_response = add_player(interaction, team, embed_deleted_player);
    } else {
      console.error(
        `inside --- error switching teams on interaction ${interaction.createdTimestamp}\ncreated by ${interaction.user}(${interaction.user.username})\n${interaction.type}`
      );
      return "error switching teams, woops";
    }
  }
  const response = handle_response(add_button_response, team); ////////////
  return response;
};
