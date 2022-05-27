const Discord = require("discord.js");
const config = require("../config.js");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });

  extraConnection.connect();

  if (args[0] == "help") {
    if (args[1] == "embedresponse") {
      const embed = new Discord.MessageEmbed()
        .setColor("#fcd403")
        .setTitle("Help - Embedded Response")
        .setThumbnail(config.logo)
        .setDescription("This will toggle whether or not the bot will reply for commands like z?stats and z?leaderboard with an embed or image. Note that embeds are generally sent quicker than images.")
        .setFooter("Enable using: z?settings embedresponse enable");

      message.reply({ embeds: [embed] });
      return;
    }
    if (args[1] == "replyping") {
      const embed = new Discord.MessageEmbed()
        .setColor("#fcd403")
        .setTitle("Help - Reply Pings")
        .setThumbnail(config.logo)
        .setDescription("This will toggle whether or not the bot will ping you when responding to commands.")
        .setFooter("Enable using: z?settings replypings enable");

      message.reply({ embeds: [embed] });
      return;
    }
    if (args[1] == "reportstatusdm") {
      const embed = new Discord.MessageEmbed()
        .setColor("#fcd403")
        .setTitle("Help - Report Status DM")
        .setThumbnail(config.logo)
        .setDescription("This will toggle whether or not the bot will send you a DM when a report is reviewed.")
        .setFooter("Enable using: z?settings reportstatusdm enable");

      message.reply({ embeds: [embed] });
      return;
    }
    if (args[1] == "suggestionstatusdm") {
      const embed = new Discord.MessageEmbed()
        .setColor("#fcd403")
        .setTitle("Help - Suggestion Status DM")
        .setThumbnail(config.logo)
        .setDescription("This will toggle whether or not the bot will send you a DM when a suggestion is reviewed.")
        .setFooter("Enable using: z?settings suggestionstatusdm enable");

      message.reply({ embeds: [embed] });
      return;
    }
  }

  if (args[0] == "embedresponse" && args[1] == "enable" || args[0] == "embedresponse" && args[1] == "on" || args[0] == "embeddedresponse" && args[1] == "on" || args[0] == "embeddedresponse" && args[1] == "on" ) {
    extraConnection.query(`UPDATE DiscordData SET embedresponse = 1 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> | Embedded response has been **enabled**!");
    });
    return;
  }
  if (args[0] == "embedresponse" && args[1] == "disable" || args[0] == "embedresponse" && args[1] == "off" || args[0] == "embeddedresponse" && args[1] == "on" || args[0] == "embeddedresponse" && args[1] == "on" ) {
    extraConnection.query(`UPDATE DiscordData SET embedresponse = 0 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> | Embedded response has been **disabled**!");
    });
    return;
  }
  if (args[0] == "replyping" && args[1] == "enable" || args[0] == "replyping" && args[1] == "on") {
    extraConnection.query(`UPDATE DiscordData SET replyping = 1 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> | Reply pings have been **enabled**!");
    });
    return;
  }
  if (args[0] == "replyping" && args[1] == "disable" || args[0] == "replyping" && args[1] == "off") {
    extraConnection.query(`UPDATE DiscordData SET replyping = 0 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> | Reply pings have been **disabled**!");
    });
    return;
  }
  if (args[0] == "reportstatusdm" && args[1] == "enable" || args[0] == "reportstatusdm" && args[1] == "on") {
    extraConnection.query(`UPDATE DiscordData SET reportstatusdm = 1 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> | Report Status DM has been **enabled**!");
    });
    return;
  }
  if (args[0] == "reportstatusdm" && args[1] == "disable" || args[0] == "reportstatusdm" && args[1] == "off") {
    extraConnection.query(`UPDATE DiscordData SET reportstatusdm = 0 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> |  Report Status DM has been **disabled**!");
    });
    return;
  }
  if (args[0] == "suggestionstatusdm" && args[1] == "enable" || args[0] == "suggestionstatusdm" && args[1] == "on") {
    extraConnection.query(`UPDATE DiscordData SET suggestionstatusdm = 1 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> | Suggestion Status DM has been **enabled**!");
    });
    return;
  }
  if (args[0] == "suggestionstatusdm" && args[1] == "disable" || args[0] == "suggestionstatusdm" && args[1] == "off") {
    extraConnection.query(`UPDATE DiscordData SET suggestionstatusdm = 0 WHERE id = ${message.author.id}`, function() {
      message.reply("<:check:883326130986303511> | Suggestion Status DM has been **disabled**!");
    });
    return;
  }

  extraConnection.query(`SELECT * FROM DiscordData WHERE id = ${message.author.id}`, function(err, results) {
    if (err) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");

    const data = JSON.parse(JSON.stringify(results));
    let content = "";

    if (data[0].embedresponse == 1) {
      content += "**Embedded Response**: <:check:883326130986303511>\n";
    } else {
      content += "**Embedded Response**: <:cross:883326239341965332>\n";
    }
    if (data[0].replyping == 1) {
      content += "**Reply Pings**: <:check:883326130986303511>\n";
    } else {
      content += "**Reply Pings**: <:cross:883326239341965332>\n";
    }
    if (data[0].reportstatusdm == 1) {
      content += "**Report Status DM**: <:check:883326130986303511>\n";
    } else {
      content += "**Report Status DM**: <:cross:883326239341965332>\n";
    }
    if (data[0].suggestionstatusdm == 1) {
      content += "**Suggestion Status DM**: <:check:883326130986303511>\n";
    } else {
      content += "**Suggestion Status DM**: <:cross:883326239341965332>\n";
    }

    const user = client.guilds.cache.get(config.Guild).members.cache.find(m => m.user.tag == message.author.tag);
    const embed = new Discord.MessageEmbed()
      .setColor("#fcd403")
      .setTitle(`Bot Settings - ${message.author.tag}`)
      .setThumbnail(`http://api.zeqa.net/api/players/avatars/${user.displayName.replace(" ", "%20")}`)
      .setDescription(content)
      .setFooter("Run z?settings help <setting> for more information on a setting.");

    message.reply({ embeds: [embed] });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "settings",
  category: "System",
  description: "Allows you to configure bot settings",
  usage: "settings"
};