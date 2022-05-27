const config = require("../config.js");
const mysql = require("mysql");
const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  function checkForBooster() {
    if (message.member.roles.cache.has(config.roles.boosterRole) || message.member.roles.cache.has(config.roles.devRole)) {
      return true;
    } else {
      return false;
    }
  }

  function checkForPlayer() {
    if (message.member.roles.cache.has(config.roles.playerRole)) {
      return true;
    } else {
      return false;
    }
  }

  function checkForSpace() {
    if (message.member.displayName.includes(" ")) {
      return true;
    } else {
      return false;
    }
  }

  if (message.author.bot) return;

  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });

  extraConnection.connect();
  extraConnection.query(`SELECT count(*) AS exist FROM PlayersData WHERE name = "${message.member.displayName}"`, function(err, result) {
    if (err) throw err;
    const data = JSON.parse(JSON.stringify(result));

    if (data[0].exist == 0) {
      message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("You need to login to Zeqa before using this command.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
    } else {
      extraConnection.query(`SELECT isboost FROM PlayersData WHERE name = "${message.member.displayName}"`, function(error, results) {
        if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");
    
        const data = JSON.parse(JSON.stringify(results));
    
        if (data[0].isboost == 1) {
          message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("You have already claimed your Booster rank - create a ticket if you believe this is an error on our part.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });        }
    
        if (data[0].isboost == 0 || data[0].isboost == null) {
          if (checkForBooster() == true && checkForPlayer() == true && checkForSpace() == false) {
            message.client.channels.cache.get("911559463088054282").send(`/setrank ${message.member.displayName} Booster`);
            extraConnection.query(`UPDATE PlayersData SET isboost = 1 WHERE name = "${message.member.displayName}"`, function(err) {
              if (err) throw err;
              client.channels.cache.get(config.channels.botLogsChannel).send(`${message.author.tag} claimed a booster rank on account: ${message.member.displayName}`);
              message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Success!").setColor("#4BB543").setDescription(`Successfully added a Booster rank to **${message.member.displayName}**!`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
            });
          }
          if (checkForBooster() == true && checkForPlayer() == true && checkForSpace() == true) {
            message.client.channels.cache.get("911559463088054282").send(`/setrank "${message.member.displayName}" Booster`);
            extraConnection.query(`UPDATE PlayersData SET isboost = 1 WHERE name = "${message.member.displayName}"`, function(err) {
              if (err) throw err;
              client.channels.cache.get(config.channels.botLogsChannel).send(`${message.author.tag} claimed a booster rank on account: ${message.member.displayName}`);
              message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Success!").setColor("#4BB543").setDescription(`Successfully added a Booster rank to **${message.member.displayName}**!`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
            });
          }
          if (checkForBooster() == true && checkForPlayer() == false) {
            message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("You need to verify your account first before claiming your rank - instructions at <#889095776192573502>.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });          }
          if (checkForBooster() == false) {
            message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("You need to boost the server to claim the Booster rank!").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
          }
        }
      });
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "booster",
  category: "Basic",
  description: "Adds the booster rank to your account if you've boosted",
  usage: "booster [username]"
};