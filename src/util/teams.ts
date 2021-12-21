export default class Team {
  constructor(team: "RED" | "BLU") {
    this.name = team;
  }
  name: "RED" | "BLU";
  otherTeam() {
    return this.name === "BLU" ? new Team("RED") : new Team("BLU");
  }
  getSeparator() {
    return this.name === "BLU" ? "|" : "£";
  }
  getOppositeSeparator() {
    return this.name === "BLU" ? "£" : "|";
  }
  getIndex() {
    // Index of field in embed, BLU is created first
    return this.name === "BLU" ? 0 : 1;
  }
}
