const Discord = require("discord.js");
const config = require("../config.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const embed = new Discord.MessageEmbed()
    .setColor("#fcd403")
    .setTitle("Zeqa - Bot Invite Link")
    .setThumbnail(config.logo)
    .setDescription("You can invite the Discord bot to your own server by using this [link](https://discord.com/api/oauth2/authorize?client_id=948227335100969092&permissions=2147780672&scope=applications.commands%20bot).\n\n**Note:** The only available commands are z?stats & z?leaderboard.")
    .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

  message.reply({ embeds: [embed] });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "invite",
  category: "Basic",
  description: "Displays the bot's invite link",
  usage: "invite"
};