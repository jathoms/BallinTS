import { Snowflake } from "discord.js";
export default (IDs: Snowflake[], otherIDs: Snowflake[]) => {
  const allPlayers = IDs.concat(otherIDs);
  return allPlayers.includes("-1"); //testing, should be negation of this
};
