const config = require("../config.js");
const { MessageEmbed } = require("discord.js");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  function checkRoles() {
    if (message.member?.roles.cache.has("874576276453740545") || message.member?.roles.cache.has("875994272560713800")) {
      return true;
    } else {
      return false;
    }
  }

  if (message.author.bot) return;
  if (!checkRoles()) return;

  const connection = mysql.createConnection({
    host: config.mysqlCredentials.host,
    user: config.mysqlCredentials.user,
    password: config.mysqlCredentials.password,
    database: config.mysqlCredentials.database
  });

  connection.connect();

  if (args[0] == null) {
    message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}createstaffprofile <username>`);
    return;
  }

  const userArr = [];
  let xuid;

  for (let i = 0; i < args.length; i++) {
    userArr.push(args[i]);
  }

  const username = userArr.join("%20");

  connection.query(`SELECT xuid FROM PlayerStats WHERE name = '${username}'`, function(error, results) {
    if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");

    const data = JSON.parse(JSON.stringify(results));
    xuid = data[0].xuid;

    connection.query(`INSERT INTO StaffStats (xuid, name, bans, kicks, mutes, tickets) VALUES (${Number(xuid)}, '${username}', 0, 0, 0, 0);`, function() {
      const embed = new MessageEmbed()
        .setColor("#fcd403")
        .setTitle("<:check:883326130986303511> | Success!")
        .setThumbnail(`http://api.zeqa.net/api/players/avatars/${username}`)
        .setDescription(`Successfully created a staff profile for **${username}**!`)
        .setFooter(`Requested by ${message.author.tag}`);

      message.reply({ embeds: [embed] });
    }); 
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["csp"],
  permLevel: "Staff"
};

exports.help = {
  name: "createstaffprofile",
  category: "Administrative",
  description: "Force creates a profile for a user on the staff database",
  usage: "createstaffprofile [username]"
};