const config = require("../config.js");
const mysql = require("mysql");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(oldMember, newMember) {
    function checkForSpace() {
      if (oldMember.displayName.includes(" ")) {
        return true;
      } else {
        return false;
      }
    }

    const extraConnection = mysql.createConnection({
      host: config.extraMysqlCredentials.host,
      user: config.extraMysqlCredentials.user,
      password: config.extraMysqlCredentials.password,
      database: config.extraMysqlCredentials.database
    });

    const oldStatus = oldMember.premiumSince;
    const newStatus = newMember.premiumSince;

    //Informs user that they can claim their rank
    if (!oldStatus && newStatus) {
      newMember.client.channels.cache.get("877018377388965929").send(`Hey ${newMember}, thanks for boosting the server!\n\nYou can claim your exclusive in-game Booster rank by running \`z?booster\` in <#874578975391883274>!`);
    }

    //Removes user's rank if they unboost
    if (oldStatus && !newStatus) {
      if (checkForSpace() == true) {
        extraConnection.query(`UPDATE PlayersData SET isboost = 0 WHERE name = "${oldMember.displayName}"`, function(err) {
          if (err) throw err;
          oldMember.client.channels.cache.get(config.channels.botLogsChannel).send(`${oldMember} / ${oldMember.displayName}'s booster rank was removed - they unboosted the server`);
          oldMember.client.channels.cache.get("911559463088054282").send(`/setrank "${oldMember.displayName}" Player`);
        });
      } else {
        extraConnection.query(`UPDATE PlayersData SET isboost = 0 WHERE name = "${oldMember.displayName}"`, function(err) {
          if (err) throw err;
          oldMember.client.channels.cache.get(config.channels.botLogsChannel).send(`${oldMember} / ${oldMember.displayName}'s booster rank was removed - they unboosted the server`);
          oldMember.client.channels.cache.get("911559463088054282").send(`/setrank ${oldMember.displayName} Player`);
        });
      }
    }
  }
};