const Discord = require("discord.js");
const request = require("request");
const config = require("../config.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  if (args.length == null) {
    message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}checkpunishment <username>`);
  }

  const userArr = [];

  for (let i = 0; i < args.length; i++) {
    userArr.push(args[i]);
  }

  const username = userArr.join("%20");
  const url = `http://api.zeqa.net/api/players/punishments/${username}`;
  const avatarUrl = `http://api.zeqa.net/api/players/avatars/${username}`;

  request.get({
    url: url,
    json: true,
    headers: { "User-Agent": "request", "Authorization": config.zeqaAPIKey }
  }, (err, res, data) => {
    if (err) {
      message.reply(`An error occured while processing your request - please ping a developer if the issue persists\n\n\`\`\`${err}\`\`\``);
    } else if (res.statusCode !== 200) {
      message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("No running punishment was found.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });          
    } else {
      if (data != null) {
        let rawDate = null;
        let year = null;
        let month = null;
        let day = null;

        if (data.duration == "-1") {
          rawDate = "Never";
        } else {
          const duration = data.duration.toString();
          year = duration.slice(0, 4);
          month = duration.slice(5, 7);
          day = duration.slice(8, 10);
          rawDate = `${day}/${month}/${year}`;
        }

        const embed = new Discord.MessageEmbed()
          .setColor("#fec900")
          .setTitle(`Current Punishment - ${data.sensitivename}`)
          .setThumbnail(avatarUrl)
          .addFields(
            { name: "Reason", value: data.reason },
            { name: "Expires On", value: rawDate.toString() },
            { name: "Banned By", value: data.staff },
          )
          .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

        message.reply({ embeds: [embed] });
      }
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["cp"],
  permLevel: "Staff"
};

exports.help = {
  name: "checkpunishment",
  category: "Staff",
  description: "Displays a player's running punishment",
  usage: "checkpunishment [user]"
};