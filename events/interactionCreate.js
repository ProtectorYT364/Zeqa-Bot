const Discord = require("discord.js");
const config = require("../config.js");
const mysql = require("mysql");
const { customAlphabet } = require("nanoid");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const extraConnection = mysql.createConnection({
      host: config.extraMysqlCredentials.host,
      user: config.extraMysqlCredentials.user,
      password: config.extraMysqlCredentials.password,
      database: config.extraMysqlCredentials.database
    });
  
    extraConnection.connect();

    if (interaction.customId === "accept_report") {
      interaction.update({ embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Player Report").setColor(0xffcd00).setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), "Status - <:check:883326130986303511>")).setFooter(interaction.message.embeds[0].footer.text)], components: [] });
      extraConnection.query(`SELECT reportstatusdm FROM DiscordData WHERE id = ${interaction.member.user.id}`, function(err, res) {
        if (err) throw err;
        const data = JSON.parse(JSON.stringify(res));

        if (data[0].reportstatusdm === 1) {
          const discordAccount = interaction.client.guilds.cache.get(config.Guild).members.cache.find(m => m.user.id == interaction.message.embeds[0].footer.text);
          
          const embed = new Discord.MessageEmbed()
            .setColor("#fcd403")
            .setTitle("Zeqa - Player Report Status")
            .setThumbnail(config.logo)
            .setDescription("Hello, thank you for submitting a player report! We have reviewed your report and have decided to **accept** it!")
            .addFields(
              { name: "Report Data", value: interaction.message.embeds[0].description.toString() },
            )
            .setFooter("You can disable this DM notification using z?settings.");
          
          discordAccount?.send({ embeds: [embed] }).catch(() => { console.log(" "); });        
        }
      });
    }
    if (interaction.customId === "deny_report") {
      const uid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);
      const reportID = uid();

      interaction.update({ content: `ID: ${reportID}`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Player Report").setColor(0xffcd00).setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), "Status - <:cross:883326239341965332>")).setFooter(interaction.message.embeds[0].footer.text)], components: [] });
      extraConnection.query(`SELECT reportstatusdm FROM DiscordData WHERE id = ${interaction.member.user.id}`, function(err, res) {
        if (err) throw err;
        const data = JSON.parse(JSON.stringify(res));

        if (data[0].reportstatusdm === 1) {
          const discordAccount = interaction.client.guilds.cache.get(config.Guild).members.cache.find(m => m.user.id == interaction.message.embeds[0].footer.text);
          
          const embed = new Discord.MessageEmbed()
            .setColor("#fcd403")
            .setTitle("Zeqa - Player Report Status")
            .setThumbnail(config.logo)
            .setDescription("Hello, thank you for submitting a player report! Though, unfortunately, we have reviewed your report and have decided to **deny** it.")
            .addFields(
              { name: "Reason", value: "Not specified" },
              { name: "Report Data", value: interaction.message.embeds[0].description.toString() },
              { name: "Report ID", value: reportID }
            )
            .setFooter("You can disable this DM notification using z?settings.");
          
          discordAccount?.send({ embeds: [embed] }).then(msg => {
            extraConnection.query(`INSERT INTO DiscordIDData (id, type, dmmessageid, messageid, userid) VALUES ("${reportID}", "report", ${msg.id}, ${interaction.message.id}, ${interaction.message.embeds[0].footer.text})`, function(err) {
              if (err) throw err;
            });
          }).catch(() => { console.log(" "); });
        }
      });
    }    
    if (interaction.customId === "accept_bug_report") {
      interaction.guild.channels.cache.get(config.channels.bugTodoChannel).send({ content: "> Confirmed bug report", embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New bug report").setColor("#ffcd00").setDescription(`${interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), "")}\n[Go to bug report](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.message.id})`).setFooter(interaction.message.embeds[0].footer.text).setTimestamp()] });
      interaction.update({ embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Bug Report").setColor(0xffcd00).setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), "**Status** - <:check:883326130986303511>")).setFooter(interaction.message.embeds[0].footer.text).setTimestamp()], components: [] });
    }
    if (interaction.customId === "deny_bug_report") {
      interaction.update({ embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Bug Report").setColor(0xffcd00).setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), "**Status** - <:cross:883326239341965332>")).setFooter(interaction.message.embeds[0].footer.text).setTimestamp()], components: [] });
    }
    if (interaction.customId === "accept_suggestion") {
      interaction.guild.channels.cache.get(config.channels.suggestionsChannel).send({ embeds: [new Discord.MessageEmbed().setColor(0xffcd00).setTitle("<:atlanta_folder:601019084468912129> New Suggestion").setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), "")).setFooter(interaction.message.embeds[0].footer.text).setTimestamp()], components: [], fetchReply: true }).then(msg => {
        msg.react("<:check:883326130986303511>");
        msg.react("<:cross:883326239341965332>");
        msg.startThread({
          name: "Comments",
          autoArchiveDuration: 60,
          reason: `Suggestion: ${interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), "")}`,
        });
      });
      interaction.update({ embeds: [new Discord.MessageEmbed().setColor(0xffcd00).setTitle("<:atlanta_folder:601019084468912129> Accepted Suggestion").setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), `**Status** - <:check:883326130986303511>\n\n**Accepted By** - ${interaction.user.tag}`)).setFooter(interaction.message.embeds[0].footer.text).setTimestamp()], components: [] });
      extraConnection.query(`SELECT suggestionstatusdm FROM DiscordData WHERE id = ${interaction.member.user.id}`, function(err, res) {
        if (err) throw err;
        const data = JSON.parse(JSON.stringify(res));

        if (data[0].suggestionstatusdm === 1) {
          const discordAccount = interaction.client.guilds.cache.get(config.Guild).members.cache.find(m => m.user.id == interaction.message.embeds[0].footer.text);
          
          const embed = new Discord.MessageEmbed()
            .setColor("#fcd403")
            .setTitle("Zeqa - Suggestion Status")
            .setThumbnail(config.logo)
            .setDescription(`Hello, thank you for submitting a suggestion! We have reviewed your suggestion and have decided to **accept** it!\n\n\n${interaction.message.embeds[0].description.toString()}`)
            .setFooter("You can disable this DM notification using z?settings.");
          
          discordAccount?.send({ embeds: [embed] }).catch(() => { console.log(" "); });            
        }
      });
    }
    if (interaction.customId === "deny_suggestion") { 
      const uid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);
      const sugestionID = uid();

      interaction.update({ content: `ID: ${sugestionID}`, embeds: [new Discord.MessageEmbed().setColor(0xffcd00).setTitle("<:atlanta_folder:601019084468912129> New Suggestion").setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), `**Status** - <:cross:883326239341965332>\n\n**Denied By** - ${interaction.user.tag}`)).setFooter(interaction.message.embeds[0].footer.text).setTimestamp()], components: [] });
      extraConnection.query(`SELECT suggestionstatusdm FROM DiscordData WHERE id = ${interaction.member.user.id}`, function(err, res) {
        if (err) throw err;
        const data = JSON.parse(JSON.stringify(res));

        if (data[0].suggestionstatusdm === 1) {
          const discordAccount = interaction.client.guilds.cache.get(config.Guild).members.cache.find(m => m.user.id == interaction.message.embeds[0].footer.text);
          
          const embed = new Discord.MessageEmbed()
            .setColor("#fcd403")
            .setTitle("Zeqa - Suggestion Status")
            .setThumbnail(config.logo)
            .setDescription("Hello, thank you for submitting a suggestion! Though, unfortunately, we have reviewed your suggestion and have decided to **deny** it.")
            .addFields(
              { name: "Reason", value: "Not specified" },
              { name: "Suggestion ID", value: sugestionID },
              { name: "Suggestion Data", value: interaction.message.embeds[0].description.toString() }
            )
            .setFooter("You can disable this DM notification using z?settings.");
          
          discordAccount?.send({ embeds: [embed] }).then(msg => {
            extraConnection.query(`INSERT INTO DiscordIDData (id, type, dmmessageid, messageid, userid) VALUES ("${sugestionID}", "suggestion", ${msg.id}, ${interaction.message.id}, ${interaction.message.embeds[0].footer.text})`, function(err) {
              if (err) throw err;
            });
          }).catch(() => { console.log(" "); });
        }
      });
    }
  }
};