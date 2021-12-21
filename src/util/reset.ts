import { MongoClient } from "mongodb";

export default (dbclient: MongoClient) => {
  const db = dbclient.db("BallinDB");

  db.collection("ballCheck").deleteMany({});
  db.collection("nextGamePlayers").deleteMany({});
  db.collection("Ballin").deleteMany({ team: { $exists: true } });
  db.collection("Ballin").updateOne(
    {},
    {
      $set: {
        ongoing: false,
        msg_id: -1,
        team_size: 2,
        gamemode: "BBALL",
        map: "bball_eu_fix",
        config: "etf2l",
        gamemode_set: false,
        map_set: false,
        config_set: false,
      },
    }
  );
};
