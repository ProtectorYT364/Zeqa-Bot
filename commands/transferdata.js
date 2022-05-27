/* eslint no-unused-vars: 0 */

const mysql = require("mysql");
const config = require("../config.js");
const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  const settings = message.settings;

  if (args[0] == null || args[1] == null) {
    message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}transferdata "<username>" "<new username>"`);
  }

  if (!message.content.includes("\"")) {
    message.reply("<:cross:883326239341965332> | You need to use double quotes around the usernames.");
    return;
  }

  if (message.content.includes("“")) {
    message.reply("You're using iOS quotes, please use normal quotes. You may copy paste this instead:");
    message.channel.send("`\"`");
    return;
  }

  const connection = mysql.createConnection({
    host: config.mysqlCredentials.host,
    user: config.mysqlCredentials.user,
    password: config.mysqlCredentials.password,
    database: config.mysqlCredentials.database
  });

  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });

  const usernames = message.content.match(/"(.*?)"/g)
  const username1 = usernames[0].replace('"', '').replace('"', '');
  const username2 = usernames[1].replace('"', '').replace('"', '');
  let xuid2;
  let sensitiveName2;

  connection.connect();
  connection.query(`SELECT xuid FROM PlayerStats WHERE name = '${username1}'`, function(error, results, fields) {
    if (error) message.channel.send("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");

    if (results.length == 0) {
      message.reply("<:cross:883326239341965332> | The account the data needs to be transferred from could not be found. Make sure they have logged onto Zeqa before.");
    } else {
      const data = JSON.parse(JSON.stringify(results));
      message.channel.send("<:loading:944992714926194688> | Successfully retrieved XUID for **" + username1 + "**.");

      connection.query(`SELECT xuid FROM PlayerStats WHERE name = '${username2}'`, function(error, results, fields) {
        if (error) message.channel.send("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");

        if (results.length == 0) {
          message.reply("<:cross:883326239341965332> | The account the data needs to be transferred to could not be found.");
        } else {
          const data2 = JSON.parse(JSON.stringify(results));
          xuid2 = data2[0].xuid;
          message.channel.send("<:loading:944992714926194688> | Successfully retrieved XUID for **" + username2 + "**.");

          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${username2}'`, function(error, results, fields) {
            const data3 = JSON.parse(JSON.stringify(results));
            sensitiveName2 = data3[0].sensitivename;

            connection.query(`DELETE FROM PlayerStats WHERE name = "${username2}"`, function(err, result) {
              if (err) throw err;
              message.channel.send("<:loading:944992714926194688> | Successfully deleted player statistics for **" + username2 + "**.");
            });
            extraConnection.query(`DELETE FROM PlayersData WHERE name = "${username2}"`, function(err, result) {
              if (err) throw err;
              message.channel.send("<:loading:944992714926194688> | Successfully deleted alias data for **" + username2 + "**.");
            });
            connection.query(`DELETE FROM PlayerDuration WHERE name = "${username2}"`, function(err, result) {
              if (err) throw err;
              message.channel.send("<:loading:944992714926194688> | Successfully deleted player duration data for **" + username2 + "**.");
            });
            connection.query(`DELETE FROM PlayerElo WHERE name = "${username2}"`, function(err, result) {
              if (err) throw err;
              message.channel.send("<:loading:944992714926194688> | Successfully deleted gamemode elo for **" + username2 + "**.");
            });
            connection.query(`DELETE FROM PlayerItems WHERE name = "${username2}"`, function(err, result) {
              if (err) throw err;
              message.channel.send("<:loading:944992714926194688> | Successfully deleted cosmetics & items for **" + username2 + "**.");
            });
            connection.query(`DELETE FROM PlayerRanks WHERE name = "${username2}"`, function(err, result) {
              if (err) throw err;
              message.channel.send("<:loading:944992714926194688> | Successfully deleted rank data for **" + username2 + "**.");
            });
            connection.query(`DELETE FROM PlayerSettings WHERE name = "${username2}"`, function(err, result) {
              if (err) throw err;
              message.channel.send("<:loading:944992714926194688> | Successfully deleted settings data for **" + username2 + "**.");
            });

            connection.query(`UPDATE PlayerStats SET xuid = ${xuid2}, name = "${username2}" WHERE name = "${username1}"`, function(err, result) {
              if (err) throw err;
              message.channel.send(`<:loading:944992714926194688> | Successfully transferred player stats from **${username1}** to **${username2}**.`);
            });
            extraConnection.query(`UPDATE PlayersData SET name = "${username2}", sensitivename = "${sensitiveName2}" WHERE name = "${username1}"`, function(err, result) {
              if (err) throw err;
              message.channel.send(`<:loading:944992714926194688> | Successfully transferred internal player data from **${username1}** to **${username2}**.`);
            });
            connection.query(`UPDATE PlayerDuration SET xuid = ${xuid2}, name = "${username2}" WHERE name = "${username1}"`, function(err, result) {
              if (err) throw err;
              message.channel.send(`<:loading:944992714926194688> | Successfully transferred player duration data from **${username1}** to **${username2}**.`);
            });
            connection.query(`UPDATE PlayerElo SET xuid = ${xuid2}, name = "${username2}" WHERE name = "${username1}"`, function(err, result) {
              if (err) throw err;
              message.channel.send(`<:loading:944992714926194688> | Successfully transferred gamemode elo from **${username1}** to **${username2}**.`);
            });
            connection.query(`UPDATE PlayerItems SET xuid = ${xuid2}, name = "${username2}" WHERE name = "${username1}"`, function(err, result) {
              if (err) throw err;
              message.channel.send(`<:loading:944992714926194688> | Successfully transferred cosmetics & items from **${username1}** to **${username2}**.`);
            });
            connection.query(`UPDATE PlayerRanks SET xuid = ${xuid2}, name = "${username2}" WHERE name = "${username1}"`, function(err, result) {
              if (err) throw err;
              message.channel.send(`<:loading:944992714926194688> | Successfully transferred rank data from **${username1}** to **${username2}**.`);
            });
            connection.query(`UPDATE PlayerSettings SET xuid = ${xuid2}, name = "${username2}" WHERE name = "${username1}"`, function(err, result) {
              if (err) throw err;
              message.channel.send(`<:loading:944992714926194688> | Successfully transferred player settings from **${username1}** to **${username2}**.`);
              message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Successfully transferred all player statistics and data from **${username1}** to **${username2}**!`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
            });
          });
        }
      });
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Dev"
};

exports.help = {
  name: "transferdata",
  category: "Administrative",
  description: "Transfers a player's data from one account to another",
  usage: "transferdata [username] [new username]"
};