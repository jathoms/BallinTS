import axios from "axios";
import dotenv from "dotenv";
import { GameFormat } from "./formats";
dotenv.config({ path: `${__dirname}/../.env` });
const apiKey = process.env.SERVEME;

const get_configs = async () => {
  try {
    const available =
      //using this http request to get a list of configs straight from serveme, as opposed to storing them indepentently
      (
        await axios.get(
          `https://serveme.tf/api/reservations/new?api_key=${apiKey}`
        )
      ).data;
    const [reservation, findServers] = [
      available.reservation,
      available.actions.find_servers,
    ];
    const configs = (
      await axios.post(`${findServers}?api_key=${apiKey}`, reservation)
    ).data.server_configs;

    return configs;
  } catch (error) {
    console.error(error);
  }
};

export default async (
  map: string,
  format: GameFormat,
  input: string | null
): Promise<string | null> => {
  const configs: { id: number; file: string }[] = await get_configs();
  const teamSize = format.teamSize;
  if (!input) {
    //some exceptions exist, which are covered in the default (no input) case for config
    switch (format.formatName) {
      case "PROLANDER": // rgl is basically required for prolander
        input = "rgl";
        break;
      case "BBALL": // default bball config: eu
      case "BBALL1V1":
        input = "eu";
        break;
      default:
        input = ""; //so that includes(input) returns every config later on
        break;
    }
  }
  let viableConfigs = configs.filter((config) => config.file.includes(input!)); //configs including the term specified (input). conveniently, includes("") is true for any relevant string
  if (viableConfigs.length === 1) {
    return viableConfigs[0].file;
  }
  if (!viableConfigs) {
    return null;
  }
  let [mapPrefix, mapSuffix] = map.split("_", 1);
  if (mapPrefix === "pl" || mapSuffix === "steel") {
    //the config for payload matches, unlike other map types, does not include the map prefix. instead this config is called "stopwatch". similarly, steel uses "stopwatch" even though its map prefix is "cp_"
    mapPrefix = "stopwatch";
  }
  let withTeamSizeAndMap;

  //now, different methods to acquire the config must be used depending on the format, as there is no single indicator of which config should be used across all game formats.
  switch (format.id) {
    case "BBALL1V1":
      withTeamSizeAndMap = viableConfigs.filter((config) =>
        config.file.toLowerCase().includes("bball")
      );
      break;
    case "BBALL":
    case "ULTIDUO":
      withTeamSizeAndMap = viableConfigs.filter((config) =>
        config.file.toLowerCase().includes(format.id.toLowerCase())
      );
      break;
    case "HIGHLANDER":
      withTeamSizeAndMap = viableConfigs.filter(
        (config) =>
          config.file.toLowerCase().includes(mapPrefix) &&
          ["hl", "highlander", "9"].some((format) =>
            config.file.toLowerCase().includes(format)
          )
      );
      break;
    default:
      withTeamSizeAndMap = viableConfigs.filter(
        (config) =>
          config.file.toLowerCase().includes(format.teamSize.toString()) &&
          ["standard", mapPrefix].some((format) =>
            config.file.toLowerCase().includes(format)
          )
      );
      break;
  }
  if (withTeamSizeAndMap.length) {
    return withTeamSizeAndMap[0].file;
  } else if (input) {
    return null;
  } else {
    return "classic";
  }
};
