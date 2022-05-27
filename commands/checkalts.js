const config = require("../config.js");
const Discord = require("discord.js");
const request = require("request");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  if (args[0] == null) {
    message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}checkalts <username>`);
  }

  const userArr = [];

  for (let i = 0; i < args.length; i++) {
    userArr.push(args[i]);
  }

  const username = userArr.join("%20");
  const url = `http://api.zeqa.net/api/players/alias/${username}`;

  if (args[0] == null) return;

  request.get({
    url: url,
    json: true,
    headers: { "User-Agent": "request", "Authorization": config.zeqaAPIKey }
  }, async (err, res, data) => {
    if (err) {
      console.log(err);
    } else if (res.statusCode !== 200) {
      console.log(res);
    } else {
      if (data != null) {
        if (data.includes("alts") && data.includes("data")) {
          const alts = data.substring(0, data.indexOf("\"},{\"data\"")).substring(9).split(",").join(", ");

          if (alts.length > 4095) return message.reply("<:cross:883326239341965332> | The list of alts is too long to display - contact a developer.");

          const embed = new Discord.MessageEmbed()
            .setColor("fec900")
            .setTitle(`Alt Accounts - ${userArr.join(" ")}`)
            .setThumbnail(`http://api.zeqa.net/api/players/avatars/${username}`)
            .setDescription(`${alts}`)
            .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

          message.reply({ embeds: [embed] });
        } else {
          message.reply(`<:cross:883326239341965332> | ${data.name} has no alt accounts.`);
        }
      }
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ca"],
  permLevel: "Staff"
};

exports.help = {
  name: "checkalts",
  category: "Staff",
  description: "Displays a player's alt accounts",
  usage: "checkalts [player]"
};