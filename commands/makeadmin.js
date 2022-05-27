const config = require("../config.js");
const Discord = require("discord.js");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  if (message.author.bot) return;
  if (args[0] == null) return message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}makeadmin [username#0000]`);

  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });
  extraConnection.connect();

  const discordUsernameArr = [];

  for (let i = 0; i < args.length; i++) {
    discordUsernameArr.push(args[i]);
  }

  const discordUsername = discordUsernameArr.join(" ");

  client.guilds.fetch(config.Guild).then(guild => {
    const discordUser = guild.members.cache.find((member) => member.user.tag === discordUsername);
    const discordID = discordUser.user.id;

    extraConnection.query(`SELECT * FROM SMPInviterData WHERE discord = '${discordID}'`, (err, result) => {
      if (err) throw err;
      const data = JSON.parse(JSON.stringify(result));

      if (data.length < 1) return message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("The target player's data could not be found in the database. Make a ticket.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });

      extraConnection.query(`UPDATE SMPInviterData SET isadmin = 1 WHERE discord = ${discordID}`, function(err) {
        if (err) throw err;

        message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Gave administrator permissions to ${discordUsername} on the SMP :thumbs_up:888353465867333632:`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
      });
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Dev"
};

exports.help = {
  name: "makeadmin",
  category: "SMP",
  description: "Gives a user administrator permissons on the SMP",
  usage: "makeadmin [username#0000]"
};