import { createActionRow as createLobbyActionRow } from "../components/lobby_interaction_row";
import {
  SlashCommandStringOption,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { createInitialStartEmbed } from "../embeds/start_embed";
import random_map from "../util/random_map";
import filter_configs from "../util/filter_configs";
import { Formats } from "../util/formats";
import get_maps from "../util/get_maps";

const getFormatsForChoices = () => {
  const choices = Array.from(Formats.keys()).map(
    (format: string): [string, string] => {
      return [Formats.get(format)!.formatName, Formats.get(format)!.id];
    }
  );

  return choices;
};
const valid_map = (maps: string[], term: string) => {
  return maps.includes(term);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start up a lobby for a TF2 match.")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("format")
        .addChoices(getFormatsForChoices())
        .setDescription("hl, 6v6, bball, etc")
        .setRequired(true)
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("map")
        .setDescription("Leave blank for a random map")
        .setRequired(false)
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("config")
        .setDescription("etf2l, ugc, rgl, etc")
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction) {
    const options = interaction.options;
    const formatName = options.getString("format")!;
    const format = Formats.get(formatName)!;
    const teamSize = format.teamSize;
    let map = options.getString("map");
    if (!map) {
      map = random_map(formatName);
    }
    if (!valid_map(await get_maps(), map)) {
      await interaction.reply({
        content: `The map "${map}" is not valid, try /maps to get a list of the valid maps!`,
        ephemeral: true,
      });
      return;
    }
    const config = await filter_configs(
      map,
      format,
      options.getString("config")
    );
    if (!config) {
      await interaction.reply({
        content: "That config does not exist for the chosen game type",
        ephemeral: true,
      });
      return;
    }
    await interaction.reply({
      embeds: [
        createInitialStartEmbed(
          interaction.user, //started by <name>
          format.formatName, //<format> check
          "eu",
          map, //on <map>
          teamSize, //first n players
          config //config: <config>
        ),
      ],
      ephemeral: false,
      components: [createLobbyActionRow()],
      fetchReply: true,
    });
  },
};
