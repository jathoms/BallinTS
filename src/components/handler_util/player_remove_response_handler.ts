import { MessageEmbed } from "discord.js";

export default (response: "success" | "fail" | "absent") => {
  switch (response) {
    case "success":
      return `Left lobby`;
    case "absent":
      return "You're not in the lobby!";
    default:
      return "some kinda error in the player remove response lol woops";
  }
};
