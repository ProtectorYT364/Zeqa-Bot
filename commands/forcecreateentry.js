const mysql = require("mysql");
const config = require("../config.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return;

  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });

  extraConnection.connect();
  extraConnection.query(`INSERT INTO DiscordData (id, embedresponse, replyping, reportstatusdm, suggestionstatusdm) VALUES (${message.author.id.toString()}, 0, 1, 1, 1) ON DUPLICATE KEY UPDATE id = '${message.author.id.toString()}', embedresponse = '0', replyping = '1', reportstatusdm = '1', suggestionstatusdm = '1';`, function(error) {
    if (error) throw error;
    
    message.reply(`<:check:883326130986303511> | Force added ${message.author.tag} to the database.`);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["fce"],
  permLevel: "Staff"
};

exports.help = {
  name: "forcecreateentry",
  category: "System",
  description: "Force creates a database entry for all users in the server",
  usage: "forcecreateentry"
};