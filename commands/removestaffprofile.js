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

  for (let i = 0; i < args.length; i++) {
    userArr.push(args[i]);
  }

  const username = userArr.join("%20");
  connection.query(`DELETE FROM StaffStats WHERE name = '${username}'`, function() {
    const embed = new MessageEmbed()
      .setColor("#fcd403")
      .setTitle("<:check:883326130986303511> | Success!")
      .setThumbnail(`http://api.zeqa.net/api/players/avatars/${username}`)
      .setDescription(`Successfully removed **${username}**'s staff profile.`)
      .setFooter(`Requested by ${message.author.tag}`);

    message.reply({ embeds: [embed] });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rsp"],
  permLevel: "Staff"
};

exports.help = {
  name: "removestaffprofile",
  category: "Administrative",
  description: "Force removes a profile for a user from the staff database",
  usage: "removestaffprofile [username]"
};