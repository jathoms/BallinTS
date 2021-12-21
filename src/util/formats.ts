export class GameFormat {
  constructor(formatName: string, id: string, teamSize: number) {
    this.formatName = formatName;
    this.id = id;
    this.teamSize = teamSize;
  }
  formatName: string;
  id: string;
  teamSize: number;
}

const Formats = new Map<string, GameFormat>();
Formats.set("BBALL", new GameFormat("BBall", "BBALL", 2));
Formats.set("SIXES", new GameFormat("6v6", "SIXES", 6));
Formats.set("HIGHLANDER", new GameFormat("Highlander", "HIGHLANDER", 9));
Formats.set("ULTIDUO", new GameFormat("Ultiduo", "ULTIDUO", 2));
Formats.set("FOURS", new GameFormat("4v4", "FOURS", 4));
Formats.set("PROLANDER", new GameFormat("Prolander (7v7)", "PROLANDER", 7));
Formats.set("BBALL1V1", new GameFormat("BBall 1v1", "BBALL1V1", 1));

export { Formats };
