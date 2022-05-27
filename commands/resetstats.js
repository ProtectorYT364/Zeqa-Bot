const mysql = require("mysql");
const config = require("../config.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  function checkRoles() {
    if (message.member?.roles.cache.has("874576276453740545") || message.member?.roles.cache.has("875994272560713800")) {
      return true;
    } else {
      return false;
    }
  }

  if (!checkRoles()) return;

  const settings = message.settings;

  if (args[0] == null) {
    message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}resetstats "<username>"`);
  }

  if (!message.content.includes("\"")) {
    message.reply("<:cross:883326239341965332> | You need to use double quotes around the usernames.");
    return;
  }

  const connection = mysql.createConnection({
    host: config.mysqlCredentials.host,
    user: config.mysqlCredentials.user,
    password: config.mysqlCredentials.password,
    database: config.mysqlCredentials.database
  });

  const username = message.content.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");

  connection.connect();
  connection.query(`SELECT * FROM PlayerStats WHERE name = '${username}'`, function(error, results) {
    if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");

    if (results.length == 0) {
      message.reply("<:cross:883326239341965332> | That username could not be found.");
    } else {
      connection.query(`UPDATE PlayerStats SET kills = 0, deaths = 0, coins = 0, shards = 0, bp = 0 WHERE name = "${username}"`, function(err) {
        if (err) throw err;
        message.reply(`<:check:883326130986303511> | Successfully reset player stats for **${username}**.`);
      });
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Staff"
};

exports.help = {
  name: "resetstats",
  category: "Administrative",
  description: "Resets a player's stats.",
  usage: "resetstats [username]"
};