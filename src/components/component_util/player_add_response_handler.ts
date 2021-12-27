import Team from "../../util/teams";

export default (
  response: "success" | "switch" | "full" | "playing",
  team: Team
) => {
  switch (response) {
    case "success":
      return `Joined ${team.name}!`;
    case "playing":
      return `Already on ${team.name}.`;
    case "full":
      return `${team.name} is full.`;
    case "switch":
      return response;
  }
};
