const Discord = require("discord.js");
const config = require("../config.js");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.content.includes("“")) {
    message.reply("You're using iOS quotes, please use normal quotes. You may copy paste this instead:");
    message.channel.send("`\"`");
    return;
  }

  function calculateElo(ogElo, amount) {
    return parseFloat(ogElo) + parseFloat(amount);
  }

  const con = mysql.createConnection({
    host: config.mysqlCredentials.host,
    user: config.mysqlCredentials.user,
    password: config.mysqlCredentials.password,
    database: config.mysqlCredentials.database
  });

  const username = message.content.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  const remainingContent = message.content.replace(username, "").trim().split(/ +/g);

  const embed = new Discord.MessageEmbed()
    .setColor("#fcd403")
    .setTitle("Zeqa - Add Elo")
    .setThumbnail(config.logo)
    .setDescription("Please confirm the following details:")
    .addFields({ name: "Player", value: username }, { name: "Gamemode", value: remainingContent[2].toLowerCase() }, { name: "Elo", value: remainingContent[3] })
    .setFooter("Note: Username is case-sensitive!");

  message.reply({ embeds: [embed] }).then(botMessage => {
    botMessage.react("✅");
    botMessage.react("❎");

    const filter = (reaction, user) => {
      return (
        ["✅", "❎"].includes(reaction.emoji.name) && user.tag === message.author.tag
      );
    };

    botMessage.awaitReactions({ filter, max: 1, time: 300000, errors: ["time"] }).then(async collected => {
      if (collected.first().emoji.name === "✅") {
        con.query(`SELECT * FROM PlayerElo WHERE name = '${username}'`, function(error, results) {
          if (error) message.reply(`Error: ${error}`);

          const data = JSON.parse(JSON.stringify(results));
          let gamemodeElo = null;

          if (remainingContent[2].toLowerCase() == "bedfight") {
            gamemodeElo = Math.floor(data[0].bedfight);
          }
          if (remainingContent[2].toLowerCase() == "boxing") {
            gamemodeElo = Math.floor(data[0].boxing);
          }
          if (remainingContent[2].toLowerCase() == "bridge") {
            gamemodeElo = Math.floor(data[0].bridge);
          }
          if (remainingContent[2].toLowerCase() == "classic") {
            gamemodeElo = Math.floor(data[0].classic);
          }
          if (remainingContent[2].toLowerCase() == "builduhc") {
            gamemodeElo = Math.floor(data[0].builduhc);
          }
          if (remainingContent[2].toLowerCase() == "combo") {
            gamemodeElo = Math.floor(data[0].combo);
          }
          if (remainingContent[2].toLowerCase() == "fist") {
            gamemodeElo = Math.floor(data[0].fist);
          }
          if (remainingContent[2].toLowerCase() == "gapple") {
            gamemodeElo = Math.floor(data[0].gapple);
          }
          if (remainingContent[2].toLowerCase() == "nodebuff") {
            gamemodeElo = Math.floor(data[0].nodebuff);
          }
          if (remainingContent[2].toLowerCase() == "soup") {
            gamemodeElo = Math.floor(data[0].soup);
          }
          if (remainingContent[2].toLowerCase() == "spleef") {
            gamemodeElo = Math.floor(data[0].spleef);
          }
          if (remainingContent[2].toLowerCase() == "sumo") {
            gamemodeElo = Math.floor(data[0].sumo);
          }
          if (remainingContent[2].toLowerCase() == "mlgrush") {
            gamemodeElo = Math.floor(data[0].mlgrush);
          }
          con.query(`UPDATE PlayerElo SET ${remainingContent[2].toLowerCase()} = '${calculateElo(gamemodeElo, remainingContent[3])}' WHERE name = '${username}';`, function(err) {
            if (err) throw err;
          });
          client.channels.cache.get(config.channels.botLogsChannel).send(`${message.author.tag} added ${remainingContent[3]} to ${username}'s ${remainingContent[2].toLowerCase()} elo`);
          botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Successfully added **${remainingContent[3]}** elo to **${username}**'s **${remainingContent[2].toLowerCase()}** statistics. They now have a total of **${calculateElo(gamemodeElo, remainingContent[3])}** elo in **${remainingContent[2].toLowerCase()}**.`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
        });
      } else botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Command cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
    }).catch(() => { botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Time limit exceeded, command cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] }); });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [""],
  permLevel: "Bot Dev"
};

exports.help = {
  name: "addelo",
  category: "Administrative",
  description: "Adds elo to a player",
  usage: "addelo \"[username]\" [gamemode] [amount]"
};