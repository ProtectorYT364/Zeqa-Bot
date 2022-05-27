const { MessageEmbed } = require("discord.js");
const config = require("../config.js");
const mysql = require("mysql");

exports.run = async(client, message, args, level) => { // eslint-disable-line no-unused-vars
    const settings = message.settings;

    function toPascalCase(string) {
        return `${string}`
            .replace(new RegExp(/[-_]+/, "g"), " ")
            .replace(new RegExp(/[^\w\s]/, "g"), "")
            .replace(
                new RegExp(/\s+(.)(\w*)/, "g"),
                ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
            )
            .replace(new RegExp(/\w/), s => s.toUpperCase());
    }

    if (args[0] == null) {
        message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}leaderboard <gamemode/stats/votes>`);
    }

    const lbName = args[0];

    const connection = mysql.createConnection({
        host: config.mysqlCredentials.host,
        user: config.mysqlCredentials.user,
        password: config.mysqlCredentials.password,
        database: config.mysqlCredentials.database
    });

    if (lbName == "bans") {
        connection.connect();
        connection.query("SELECT @rank:= @rank + 1 as rank, s.* FROM (   SELECT name, bans FROM StaffStats, (SELECT @rank:=0) r ORDER BY bans DESC LIMIT 11   ) s", function(error, results) {
            if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n``` + error + ```");

            const data = JSON.parse(JSON.stringify(results));
            connection.query(`SELECT name, bans FROM StaffStats WHERE name = "${message.member.displayName}"`, function(error, results) {

                if (data.length < 1) {
                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nBans: \`${data[0].bans}\`\n\n**🥈 » ${data[1].name}**\nBans: \`${data[1].bans}\`\n\n**🥉 » ${data[2].name}**\nBans: \`${data[2].bans}\`\n\n**4th » ${data[3].name}**\nBans: \`${data[3].bans}\`\n\n**5th » ${data[4].name}**\nBans: \`${data[4].bans}\`\n\n**6th » ${data[5].name}**\nBans: \`${data[5].bans}\`\n\n**7th » ${data[6].name}**\nBans: \`${data[6].bans}\`\n\n**8th » ${data[7].name}**\nBans: \`${data[7].bans}\`\n\n**9th » ${data[8].name}**\nBans: \`${data[8].bans}\`\n\n**10th » ${data[9].name}**\nBans: \`${data[9].bans}\`\n\n`)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                } else {
                    const data2 = JSON.parse(JSON.stringify(results));

                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nBans: \`${data[0].bans}\`\n\n**🥈 » ${data[1].name}**\nBans: \`${data[1].bans}\`\n\n**🥉 » ${data[2].name}**\nBans: \`${data[2].bans}\`\n\n**4th » ${data[3].name}**\nBans: \`${data[3].bans}\`\n\n**5th » ${data[4].name}**\nBans: \`${data[4].bans}\`\n\n**6th » ${data[5].name}**\nBans: \`${data[5].bans}\`\n\n**7th » ${data[6].name}**\nBans: \`${data[6].bans}\`\n\n**8th » ${data[7].name}**\nBans: \`${data[7].bans}\`\n\n**9th » ${data[8].name}**\nBans: \`${data[8].bans}\`\n\n**10th » ${data[9].name}**\nBans: \`${data[9].bans}\`\n\n\n**⭐ » ${data2[0].name}**\nBans: \`${data2[0].bans}\``)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                }
            });
        });
    } else if (lbName == "mutes") {
        connection.connect();
        connection.query("SELECT @rank:= @rank + 1 as rank, s.* FROM (   SELECT name, mutes FROM StaffStats, (SELECT @rank:=0) r ORDER BY mutes DESC LIMIT 11   ) s", function(error, results) {
            if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n``` + error + ```");

            const data = JSON.parse(JSON.stringify(results));
            connection.query(`SELECT name, mutes FROM StaffStats WHERE name = "${message.member.displayName}"`, function(error, results) {

                if (data.length < 1) {
                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nMutes: \`${data[0].mutes}\`\n\n**🥈 » ${data[1].name}**\nMutes: \`${data[1].mutes}\`\n\n**🥉 » ${data[2].name}**\nMutes: \`${data[2].mutes}\`\n\n**4th » ${data[3].name}**\nMutes: \`${data[3].mutes}\`\n\n**5th » ${data[4].name}**\nMutes: \`${data[4].mutes}\`\n\n**6th » ${data[5].name}**\nMutes: \`${data[5].mutes}\`\n\n**7th » ${data[6].name}**\nMutes: \`${data[6].mutes}\`\n\n**8th » ${data[7].name}**\nMutes: \`${data[7].mutes}\`\n\n**9th » ${data[8].name}**\nMutes: \`${data[8].mutes}\`\n\n**10th » ${data[9].name}**\nMutes: \`${data[9].mutes}\`\n\n`)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                } else {
                    const data2 = JSON.parse(JSON.stringify(results));

                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nMutes: \`${data[0].mutes}\`\n\n**🥈 » ${data[1].name}**\nMutes: \`${data[1].mutes}\`\n\n**🥉 » ${data[2].name}**\nMutes: \`${data[2].mutes}\`\n\n**4th » ${data[3].name}**\nMutes: \`${data[3].mutes}\`\n\n**5th » ${data[4].name}**\nMutes: \`${data[4].mutes}\`\n\n**6th » ${data[5].name}**\nMutes: \`${data[5].mutes}\`\n\n**7th » ${data[6].name}**\nMutes: \`${data[6].mutes}\`\n\n**8th » ${data[7].name}**\nMutes: \`${data[7].mutes}\`\n\n**9th » ${data[8].name}**\nMutes: \`${data[8].mutes}\`\n\n**10th » ${data[9].name}**\nMutes: \`${data[9].mutes}\`\n\n\n**⭐ » ${data2[0].name}**\nMutes: \`${data2[0].mutes}\``)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                }
            });
        });
    } else if (lbName == "tickets") {
        connection.connect();
        connection.query("SELECT @rank:= @rank + 1 as rank, s.* FROM (   SELECT name, tickets FROM StaffStats, (SELECT @rank:=0) r ORDER BY tickets DESC LIMIT 11   ) s", function(error, results) {
            if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n``` + error + ```");

            const data = JSON.parse(JSON.stringify(results));
            connection.query(`SELECT name, tickets FROM StaffStats WHERE name = "${message.member.displayName}"`, function(error, results) {

                if (data.length < 1) {
                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nTickets Handled: \`${data[0].tickets}\`\n\n**🥈 » ${data[1].name}**\nTickets Handled: \`${data[1].tickets}\`\n\n**🥉 » ${data[2].name}**\nTickets Handled: \`${data[2].tickets}\`\n\n**4th » ${data[3].name}**\nTickets Handled: \`${data[3].tickets}\`\n\n**5th » ${data[4].name}**\nTickets Handled: \`${data[4].tickets}\`\n\n**6th » ${data[5].name}**\nTickets Handled: \`${data[5].tickets}\`\n\n**7th » ${data[6].name}**\nTickets Handled: \`${data[6].tickets}\`\n\n**8th » ${data[7].name}**\nTickets Handled: \`${data[7].tickets}\`\n\n**9th » ${data[8].name}**\nTickets Handled: \`${data[8].tickets}\`\n\n**10th » ${data[9].name}**\nTickets Handled: \`${data[9].tickets}\`\n\n`)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                } else {
                    const data2 = JSON.parse(JSON.stringify(results));

                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nTickets Handled: \`${data[0].tickets}\`\n\n**🥈 » ${data[1].name}**\nTickets Handled: \`${data[1].tickets}\`\n\n**🥉 » ${data[2].name}**\nTickets Handled: \`${data[2].tickets}\`\n\n**4th » ${data[3].name}**\nTickets Handled: \`${data[3].tickets}\`\n\n**5th » ${data[4].name}**\nTickets Handled: \`${data[4].tickets}\`\n\n**6th » ${data[5].name}**\nTickets Handled: \`${data[5].tickets}\`\n\n**7th » ${data[6].name}**\nTickets Handled: \`${data[6].tickets}\`\n\n**8th » ${data[7].name}**\nTickets Handled: \`${data[7].tickets}\`\n\n**9th » ${data[8].name}**\nTickets Handled: \`${data[8].tickets}\`\n\n**10th » ${data[9].name}**\nTickets Handled: \`${data[9].tickets}\`\n\n\n**⭐ » ${data2[0].name}**\nTickets Handled: \`${data2[0].tickets}\``)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                }
            });
        });
    } else if (lbName == "kicks") {
        connection.connect();
        connection.query("SELECT @rank:= @rank + 1 as rank, s.* FROM (   SELECT name, kicks FROM StaffStats, (SELECT @rank:=0) r ORDER BY DESC LIMIT 11   ) s", function(error, results) {
            if (error) message.reply("An error occured while proccessing your request - please contact a developer if the error persists.\n``` + error + ```");

            const data = JSON.parse(JSON.stringify(results));
            connection.query(`SELECT name, kicks FROM StaffStats WHERE name = "${message.member.displayName}"`, function(error, results) {

                if (data.length < 1) {
                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nKicks: \`${data[0].kicks}\`\n\n**🥈 » ${data[1].name}**\nKicks: \`${data[1].kicks}\`\n\n**🥉 » ${data[2].name}**\nKicks: \`${data[2].kicks}\`\n\n**4th » ${data[3].name}**\nKicks: \`${data[3].kicks}\`\n\n**5th » ${data[4].name}**\nKicks: \`${data[4].kicks}\`\n\n**6th » ${data[5].name}**\nKicks: \`${data[5].kicks}\`\n\n**7th » ${data[6].name}**\nKicks: \`${data[6].kicks}\`\n\n**8th » ${data[7].name}**\nKicks: \`${data[7].kicks}\`\n\n**9th » ${data[8].name}**\nKicks: \`${data[8].kicks}\`\n\n**10th » ${data[9].name}**\nKicks: \`${data[9].kicks}\`\n\n`)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                } else {
                    const data2 = JSON.parse(JSON.stringify(results));

                    const embed = new MessageEmbed()
                        .setColor("#fcd403")
                        .setTitle(`Staff Leaderboard - ${toPascalCase(lbName)}`)
                        .setThumbnail(config.logo)
                        .setDescription(`**🥇 » ${data[0].name}**\nKicks: \`${data[0].kicks}\`\n\n**🥈 » ${data[1].name}**\nKicks: \`${data[1].kicks}\`\n\n**🥉 » ${data[2].name}**\nKicks: \`${data[2].kicks}\`\n\n**4th » ${data[3].name}**\nKicks: \`${data[3].kicks}\`\n\n**5th » ${data[4].name}**\nKicks: \`${data[4].kicks}\`\n\n**6th » ${data[5].name}**\nKicks: \`${data[5].kicks}\`\n\n**7th » ${data[6].name}**\nKicks: \`${data[6].kicks}\`\n\n**8th » ${data[7].name}**\nKicks: \`${data[7].kicks}\`\n\n**9th » ${data[8].name}**\nKicks: \`${data[8].kicks}\`\n\n**10th » ${data[9].name}**\nKicks: \`${data[9].kicks}\`\n\n\n**⭐ » ${data2[0].name}**\nKicks: \`${data2[0].kicks}\``)
                        .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());

                    message.reply({ embeds: [embed] });
                }
            });
        });
    } else {
        message.reply("<:cross:883326239341965332> | That leaderboard could not be found.");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["slb", "stafflb"],
    permLevel: "Staff"
};

exports.help = {
    name: "staffleaderboard",
    category: "Staff",
    description: "Displays leaderboard for staff statistics",
    usage: "staffleaderboard [bans/mutes/kicks/tickets]"
};