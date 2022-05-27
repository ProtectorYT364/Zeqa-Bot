const { MessageEmbed } = require("discord.js");
const config = require("../config.js");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const connection = mysql.createConnection({
    host: config.mysqlCredentials.host,
    user: config.mysqlCredentials.user,
    password: config.mysqlCredentials.password,
    database: config.mysqlCredentials.database
  });

  connection.connect();
  connection.query(`SELECT * FROM PlayerRanks WHERE rank1 = '${args[0]}' OR rank2 = '${args[0]}' OR rank3 = '${args[0]}' OR rank4 = '${args[0]}' OR rank5 = '${args[0]}'`, function(error, results) {
    if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n\n``` + error + ```");

    const data = JSON.parse(JSON.stringify(results));
    let output = "";

    for (const [i, acc] of data.entries()) {
      output += `**${i + 1}**. ${acc.name}\n`;
    }

    if (output.length > 4095) return message.reply("<:cross:883326239341965332> | The list for that rank is too long to display.");

    const embed = new MessageEmbed()
      .setTitle(`Rank List - ${args[0]}`)
      .setThumbnail(config.logo)
      .setColor("#ffcd00")
      .setDescription(output)
      .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

    message.reply({ embeds: [embed] });    
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rl"],
  permLevel: "Staff"
};

exports.help = {
  name: "ranklist",
  category: "Staff",
  description: "Displays a list of players with the specified rank",
  usage: "ranklist [rank]"
};