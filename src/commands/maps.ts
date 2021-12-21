import {
  SlashCommandStringOption,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, Util } from "discord.js";
import get_maps from "../util/get_maps";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("maps")
    .setDescription("Get available maps matching search term")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("term")
        .setDescription("Returns all maps containing the term specified")
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    const term = interaction.options.getString("term")!;
    const maps = await get_maps();
    const filteredMaps = maps
      .filter((map: string) => map.includes(term))
      .join("\n");

    const response = filteredMaps ? "Check DMs!" : `No maps matching "${term}"`;
    await interaction.reply({
      content: response,
      ephemeral: true,
    });
    if (!filteredMaps) {
      return;
    }

    const [first, ...rest] = Util.splitMessage(filteredMaps, {
      maxLength: 4000,
    });
    let unformattedText = first.replace("_", "\\_");
    let mapsEmbed = new MessageEmbed()
      .setColor("#42f5f2")
      .setDescription(unformattedText)
      .setAuthor(`Maps matching "${term}":\n\n`)
      .setTimestamp();

    await interaction.user.send({ embeds: [mapsEmbed] });
    if (rest.length) {
      for (const text of rest) {
        unformattedText = text.replace("_", "\\_");
        mapsEmbed.setDescription(unformattedText + "\n");
        await interaction.user.send({ embeds: [mapsEmbed] });
      }
    }
  },
};
