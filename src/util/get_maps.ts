import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });
const apiKey = process.env.SERVEME;

export default async (): Promise<string[]> => {
  const maps: { maps: string[]; cloud_maps: string[] } =
    //using this http request to get a list of configs straight from serveme, as opposed to storing them indepentently
    (await axios.get(`https://serveme.tf/api/maps?api_key=${apiKey}`)).data;

  return maps.maps;
};
