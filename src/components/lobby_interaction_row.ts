import { MessageActionRow, MessageButton } from "discord.js";
import Team from "../util/teams";

const createJoinButton = (team: Team, full: boolean) => {
  let emojiId;
  if (team.name === "BLU") {
    emojiId = "867868050811650068"; //ID for BLU emoji in original ballin server
  } else {
    emojiId = "867869380209410088"; //ID for RED emoji in original ballin server
  }
  const button = new MessageButton()
    .setEmoji(emojiId)
    .setCustomId(`${team.name}button`)
    .setLabel(emojiId === "0" ? team.name : "")
    .setStyle(team.name === "RED" ? "DANGER" : "PRIMARY")
    .setDisabled(full);
  return button;
};
const createLeaveButton = () => {
  const button = new MessageButton()
    .setCustomId(`leaveButton`)
    .setLabel("fear")
    .setStyle("SECONDARY");
  return button;
};

export const createActionRow = (full: boolean = false) => {
  const row = new MessageActionRow().addComponents([
    createJoinButton(new Team("BLU"), full),
    createJoinButton(new Team("RED"), full),
    createLeaveButton(),
  ]);
  return row;
};
