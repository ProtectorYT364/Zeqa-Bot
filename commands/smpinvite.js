const config = require("../config.js");
const Discord = require("discord.js");
const mysql = require("mysql");
const Nodeactyl = require('nodeactyl');
const panelClient = new Nodeactyl.NodeactylClient("https://console.zeqa.net", "wi4DBFrTPopQidfBT8wuzDs4Vg1nhKFKpXnDoMHbYNt9uf1b");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  function checkRoles() {
    if (message.member?.roles.cache.has("967423037215473664") && message.member?.roles.cache.has("874576915078459402") || message.member?.roles.cache.has("874576276453740545") && message.member?.roles.cache.has("874576915078459402") || message.member?.roles.cache.has("875994272560713800") && message.member?.roles.cache.has("874576915078459402")) {
      return true;
    } else {
      return false;
    }
  }
  function checkForSpace(str) {
    if (str.includes(" ")) {
      return true;
    } else {
      return false;
    }
  }

  if (message.author.bot) return;
  if (!checkRoles()) return;
  if (!message.content.includes("\"")) {
    message.reply("<:cross:883326239341965332> | You need to use double quotes around the username and Discord username.");
    return;
  }
  if (message.content.includes("”")) {
    message.reply("You're using iOS quotes, please use normal quotes. You may copy paste this instead:");
    message.channel.send("`\"`");
    return;
  }
  if (args[0] == null) return message.reply(`❎ | Usage: ${settings.prefix}smpinvite "[username]" "[discord username]"`);

  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });
  extraConnection.connect();

  const usernames = message.content.match(/"(.*?)"/g)
  const username = usernames[0].replace('"', '').replace('"', '');
  const discordUsername = usernames[1].replace('"', '').replace('"', '');

  client.guilds.fetch(config.Guild).then(guild => {
    const discordUser = guild.members.cache.find((member) => member.user.tag === discordUsername);
    const discordID = discordUser.user.id;

    extraConnection.query(`SELECT count(*) AS exist FROM SMPInvitesData WHERE username = "${username}"`, function(err, result) {
      if (err) throw err;
      const data = JSON.parse(JSON.stringify(result));
        
      if (data[0].exist == 1) {
        message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("The player you are trying to invite has already been invited.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
      } else {
        extraConnection.query(`SELECT * FROM SMPInviterData WHERE discord = "${message.author.id}"`, (err, result) => {
          if (err) throw err;
          const data = JSON.parse(JSON.stringify(result));
    
          if (data.length < 1) return message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Your data could not be found in the database. Make a ticket.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
    
          if (data[0].invitecount == 0 && data[0].isadmin == 0) {
            const embed = new Discord.MessageEmbed()
              .setColor("#fcd403")
              .setTitle("ZeqaSMP - Invite Player")
              .setThumbnail(config.logo)
              .setDescription("Please confirm the following details:")
              .addFields({ name: "Player", value: username }, { name: "Discord Username", value: discordUsername })
              .setFooter("You will have one more invite left if you decide to invite this player.");
    
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
                  extraConnection.query(`UPDATE SMPInviterData SET playeronename = "${username}", playeronediscord = "${discordID}", invitecount = 1 WHERE discord = "${message.author.id}"`, function(error) {
                    if (error) message.reply(`Error: ${error}`);
                  });
                  extraConnection.query(`INSERT INTO SMPInvitesData (username, discord, invitedbydiscord, invitedbyusername) VALUES ("${username}", "${discordID}", "${message.author.id}", "${message.member.displayName}") ON DUPLICATE KEY UPDATE discord = '${discordID}', username = '${username}', invitedbydiscord = '${message.author.id}', invitedbyusername = '${message.member.displayName}'`, function(err) {
                    if (err) throw err;
                  });
                  extraConnection.query(`INSERT INTO SMPInviterData (username, discord, isadmin, invitecount) VALUES ("${username}", "${discordID}", 0, 0) ON DUPLICATE KEY UPDATE discord = '${discordID}', username = '${username}', isadmin = 0, invitecount = 0`, function(err) {
                    if (err) throw err;
                  });
                  client.channels.cache.get("966594999942795305").send({
                    embeds: [new Discord.MessageEmbed().setTitle("New Player Invited").setColor("#4BB543").addFields({ name: "Username", value: username }, { name: "Discord Username", value: discordUsername }, { name: "Discord ID", value: discordUser.user.id }, { name: "Invited By - Username", value: message.member.displayName }, { name: "Invited By - Discord Username", value: message.author.tag }, { name: "Invited By - Discord ID", value: message.author.id }).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())]
                  });
                  discordUser.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.name == "SMP"));
                  botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Successfully invited "${username}" to the SMP, they will be able to join once whitelisted - it may take a few hours for them to be able to join.`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
                  if (checkForSpace(username)) {
                    client.channels.cache.get("966594999942795305").send("<@521610855058505730> Above user needs to be manually whitelisted.");
                  } else {
                    panelClient.sendServerCommand("28c94584", `whitelist add .${username}`)
                  }
                  client.channels.cache.get("966594284696514630").send({ embeds: [new Discord.MessageEmbed().setTitle("Welcome!").setColor("#ff3333").setDescription(`Welcome to the Zeqa SMP, ${discordUser.user.username}! Take a look around the new channels you've been given access to for now. You can join the SMP using the IP zeqa.net and port 19133 - we hope you have fun!`).setFooter({ text: `Invited to the SMP by ${message.author.tag}` })] });
                } else botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Invite cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
              }).catch(() => { botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Time limit exceeded, invite cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] }); });
            });
          }
          if (data[0].invitecount == 1 && data[0].isadmin == 0) {
            const embed = new Discord.MessageEmbed()
              .setColor("#fcd403")
              .setTitle("ZeqaSMP - Invite Player")
              .setThumbnail(config.logo)
              .setDescription("Please confirm the following details:")
              .addFields({ name: "Player", value: username }, { name: "Discord Username", value: discordUsername })
              .setFooter("You will have no more invites left if you decide to invite this player.");
    
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
                  extraConnection.query(`UPDATE SMPInviterData SET playertwoname = "${username}", playertwodiscord = "${discordID}", invitecount = 1 WHERE discord = "${message.author.id}"`, function(error) {
                    if (error) message.reply(`Error: ${error}`);
                  });
                  extraConnection.query(`INSERT INTO SMPInvitesData (username, discord, invitedbydiscord, invitedbyusername) VALUES ("${username}", "${discordID}", "${message.author.id}", "${message.member.displayName}") ON DUPLICATE KEY UPDATE discord = '${discordID}', username = '${username}', invitedbydiscord = '${message.author.id}', invitedbyusername = '${message.member.displayName}'`, function(err) {
                    if (err) throw err;
                  });
                  extraConnection.query(`INSERT INTO SMPInviterData (username, discord, isadmin, invitecount) VALUES ("${username}", "${discordID}", 0, 0) ON DUPLICATE KEY UPDATE discord = '${discordID}', username = '${username}', isadmin = 0, invitecount = 0`, function(err) {
                    if (err) throw err;
                  });
                  client.channels.cache.get("966594999942795305").send({
                    embeds: [new Discord.MessageEmbed().setTitle("New Player Invited").setColor("#4BB543").addFields({ name: "Username", value: username }, { name: "Discord Username", value: discordUsername }, { name: "Discord ID", value: discordUser.user.id }, { name: "Invited By - Username", value: message.member.displayName }, { name: "Invited By - Discord Username", value: message.author.tag }, { name: "Invited By - Discord ID", value: message.author.id }).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())]
                  });
                  discordUser.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.name == "SMP"));
                  botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Successfully invited "${username}" to the SMP, they will be able to join once whitelisted - it may take a few hours for them to be able to join.`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
                  if (checkForSpace(username)) {
                    client.channels.cache.get("966594999942795305").send("<@521610855058505730> Above user needs to be manually whitelisted.");
                  } else {
                    panelClient.sendServerCommand("28c94584", `whitelist add .${username}`)
                  }
                  client.channels.cache.get("966594284696514630").send({ embeds: [new Discord.MessageEmbed().setTitle("Welcome!").setColor("#ff3333").setDescription(`Welcome to the Zeqa SMP, ${discordUser.user.username}! Take a look around the new channels you've been given access to for now. You can join the SMP using the IP zeqa.net and port 19133 - we hope you have fun!`).setFooter({ text: `Invited to the SMP by ${message.author.tag}` })] });
                } else botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Invite cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
              }).catch(() => { botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Time limit exceeded, invite cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] }); });
            });
          }
          if (data[0].invitecount == 2 && data[0].isadmin == 0) {
            message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("You have reached the maximum number of invitations (2).").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
          }
          if (data[0].isadmin == 1) {
            const embed = new Discord.MessageEmbed()
              .setColor("#fcd403")
              .setTitle("ZeqaSMP - Invite Player")
              .setThumbnail(config.logo)
              .setDescription("Please confirm the following details:")
              .addFields({ name: "Player", value: username }, { name: "Discord Username", value: discordUsername })
              .setFooter("You will have unlimited invites left if you decide to invite this player.");
    
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
                  extraConnection.query(`UPDATE SMPInviterData SET invitecount = invitecount + 1 WHERE discord = "${message.author.id}"`, function(error) {
                    if (error) message.reply(`Error: ${error}`);
                  });
                  extraConnection.query(`INSERT INTO SMPInvitesData (username, discord, invitedbydiscord, invitedbyusername) VALUES ("${username}", "${discordID}", "${message.author.id}", "${message.member.displayName}") ON DUPLICATE KEY UPDATE discord = '${discordID}', username = '${username}', invitedbydiscord = '${message.author.id}', invitedbyusername = '${message.member.displayName}'`, function(err) {
                    if (err) throw err;
                  });
                  extraConnection.query(`INSERT INTO SMPInviterData (username, discord, isadmin, invitecount) VALUES ("${username}", "${discordID}", 0, 0) ON DUPLICATE KEY UPDATE discord = '${discordID}', username = '${username}', isadmin = 0, invitecount = 0`, function(err) {
                    if (err) throw err;
                  });
                  client.channels.cache.get("966594999942795305").send({
                    embeds: [new Discord.MessageEmbed().setTitle("New Player Invited").setColor("#4BB543").addFields({ name: "Username", value: username }, { name: "Discord Username", value: discordUsername }, { name: "Discord ID", value: discordUser.user.id }, { name: "Invited By - Username", value: message.member.displayName }, { name: "Invited By - Discord Username", value: message.author.tag }, { name: "Invited By - Discord ID", value: message.author.id }).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())]
                  });
                  discordUser.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.name == "SMP"));
                  botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Done!").setColor("#4BB543").setDescription(`Successfully invited "${username}" to the SMP, they will be able to join once whitelisted - it may take a few hours for them to be able to join.`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
                  if (checkForSpace(username)) {
                    client.channels.cache.get("966594999942795305").send("<@521610855058505730> Above user needs to be manually whitelisted.");
                  } else {
                    panelClient.sendServerCommand("28c94584", `whitelist add .${username}`)
                  }
                  client.channels.cache.get("966594284696514630").send({ embeds: [new Discord.MessageEmbed().setTitle("Welcome!").setColor("#ff3333").setDescription(`Welcome to the Zeqa SMP, ${discordUser.user.username}! Take a look around the new channels you've been given access to for now. You can join the SMP using the IP zeqa.net and port 19133 - we hope you have fun!`).setFooter({ text: `Invited to the SMP by ${message.author.tag}` })] });
                } else botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Invite cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
              }).catch(() => { botMessage.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("Time limit exceeded, invite cancelled.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] }); });
            });
          }
        });
      }
    });
  }).catch(() => {
    message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("The Discord account of the user who are trying to invite could not be found. Make sure they are in the Zeqa Discord server.").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "smpinvite",
  category: "SMP",
  description: "Invites a player to the Zeqa SMP",
  usage: "smpinvite [username] [discord username]"
};