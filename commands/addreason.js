const Discord = require("discord.js");
const config = require("../config.js");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  if (message.author.bot) return;
  if (args[0] == null) return message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}addreason [id] [reason]`);

  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });
  extraConnection.connect();

  const reasonArr = [];

  for (let i = 1; i < args.length; i++) {
    reasonArr.push(args[i]);
  }

  const id = args[0];
  const reason = reasonArr.join(" ");

  extraConnection.query(`SELECT * FROM DiscordIDData WHERE id = '${id}'`, (err, result) => {
    if (err) throw err;
    const data = JSON.parse(JSON.stringify(result));

    if (data.length < 1) return message.reply({ embeds: [new Discord.MessageEmbed().setTitle("ID not found").setColor("#ff3333").setDescription("That ID could not be found in the database. Perhaps you made a typo?").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });

    const user = client.users.cache.get(data[0].userid);
    if (!user.dmChannel) return console.log(" ");

    user.dmChannel.messages.fetch(data[0].dmmessageid).then(dmMessage => {
      if (data[0].type == "report") {
        const channel = message.guild.channels.cache.get("878969363603001344");

        channel.messages.fetch(data[0].messageid).then(m => {
          const embed = new Discord.MessageEmbed()
            .setColor("#fcd403")
            .setTitle("Zeqa - Player Report Status")
            .setThumbnail(config.logo)
            .setDescription("Hello, thank you for submitting a player report! Though, unfortunately, we have reviewed your report and have decided to **deny** it.")
            .addFields({ name: "Reason", value: reason }, { name: "Report Data", value: m.embeds[0].description.toString() }, { name: "Report ID", value: data[0].id })
            .setFooter("You can disable this DM notification using z?settings.");

          dmMessage.edit({ embeds: [embed] });

          message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Successfully added reason to report **${data[0].id}**!`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
        });
      } else {
        const channel = message.guild.channels.cache.get("883716208879345754");

        channel.messages.fetch(data[0].messageid).then(m => {
          const embed = new Discord.MessageEmbed()
            .setColor("#fcd403")
            .setTitle("Zeqa - Suggestion Status")
            .setThumbnail(config.logo)
            .setDescription("Hello, thank you for submitting a suggestion! Though, unfortunately, we have reviewed your suggestion and have decided to **deny** it.")
            .addFields({ name: "Reason", value: reason }, { name: "Suggestion", value: m.embeds[0].description.toString() }, { name: "Suggestion ID", value: data[0].id })
            .setFooter("You can disable this DM notification using z?settings.");

          dmMessage.edit({ embeds: [embed] });

          message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Successfully added reason to suggestion **${data[0].id}**!`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
        });
      }
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ar"],
  permLevel: "Staff"
};

exports.help = {
  name: "addreason",
  category: "Staff",
  description: "Adds reason for denial of report or suggestion",
  usage: "addreason [id] [reason]"
};