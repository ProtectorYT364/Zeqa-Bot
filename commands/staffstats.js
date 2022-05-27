const config = require("../config.js");
const mysql = require("mysql");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  if (args[0] == null) {
    message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}staffstats <username>`);
  }

  const connection = mysql.createConnection({
    host: config.mysqlCredentials.host,
    user: config.mysqlCredentials.user,
    password: config.mysqlCredentials.password,
    database: config.mysqlCredentials.database
  });

  const userArr = [];

  for (let i = 0; i < args.length; i++) {
    userArr.push(args[i]);
  }

  const username = userArr.join(" ");
  const usernameUrl = userArr.join("%20");

  connection.connect();
  connection.query(`SELECT * FROM StaffStats WHERE name = '${username}'`, function(error, results) {
    if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");

    if (results.length == 0) {
      message.reply("<:cross:883326239341965332> | That staff member was not found. If you think this is an error, please contact AreroLR.");
    } else {
      const data = JSON.parse(JSON.stringify(results));
      const embed = new MessageEmbed()
        .setColor("#fcd403")
        .setTitle(`Staff Statistics - ${username}`)
        .setThumbnail(`http://api.zeqa.net/api/players/avatars/${usernameUrl}`)
        .addFields(
          { name: "Bans", value: data[0].bans.toString() },
          { name: "Mutes", value: data[0].mutes.toString() },
          { name: "Kicks", value: data[0].kicks.toString() },
          { name: "Tickets Handled", value: data[0].tickets.toString() }
        )
        .setFooter({ text: `Command requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL });

      message.reply({ embeds: [embed] });
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ss"],
  permLevel: "Staff"
};

exports.help = {
  name: "staffstats",
  category: "Staff",
  description: "Displays staff statistics for a staff member",
  usage: "staffstats [username]"
};