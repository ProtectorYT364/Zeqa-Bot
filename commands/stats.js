const config = require("../config.js");
const Discord = require("discord.js");
const Canvas = require("canvas");
const moment = require("moment");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  function secondsToHours(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);

    const hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    return hDisplay;
  }
  function checkPlayTime(hours) {
    if (hours == "") {
      return "Too less to display";
    } else {
      return hours;
    }
  }

  const connection = mysql.createConnection({
    host: config.mysqlCredentials.host,
    user: config.mysqlCredentials.user,
    password: config.mysqlCredentials.password,
    database: config.mysqlCredentials.database
  });
  const extraConnection = mysql.createConnection({
    host: config.extraMysqlCredentials.host,
    user: config.extraMysqlCredentials.user,
    password: config.extraMysqlCredentials.password,
    database: config.extraMysqlCredentials.database
  });

  if (args[0] == null) return message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}stats <username>`);

  const userArr = [];

  for (let i = 0; i < args.length; i++) {
    userArr.push(args[i]);
  }

  message.reply("Fetching, please wait...").then(async (msg) => {
    const username = userArr.join(" ");

    connection.connect();
    extraConnection.connect();
  
    connection.query(`SELECT a.name, a.kills, a.deaths, a.coins, a.shards, a.bp, b.mlgrush, b.bedfight, b.boxing, b.bridge, b.builduhc, b.combo, b.fist, b.gapple, b.nodebuff, b.soup, b.spleef, b.sumo, b.battlerush, b.stickfight, b.classic, c.rank1, d.lastplayed, d.totalonline FROM PlayerStats AS a INNER JOIN PlayerElo AS b ON a.name = b.name INNER JOIN PlayerRanks AS c ON a.name = c.name INNER JOIN PlayerDuration as d ON a.name = d.name WHERE a.name = '${username}';`, (err, res) => {
      if (err) console.log("Error: ", err);

      if (res.length == 0) {
        msg.edit("<:cross:883326239341965332> | That player was not found.");
        return;
      }
  
      const data = JSON.parse(JSON.stringify(res));
      const stats = [];
      stats.push({ kills: data[0].kills, deaths: data[0].deaths, coins: data[0].coins, shards: data[0].shards, bp: data[0].bp, rank: data[0].rank1, lastplayed: data[0].lastplayed, totalonline: data[0].totalonline, mlgrush: data[0].mlgrush, bedfight: data[0].bedfight, boxing: data[0].boxing, bridge: data[0].bridge, builduhc: data[0].builduhc, combo: data[0].combo, classic: data[0].classic, fist: data[0].fist, gapple: data[0].gapple, nodebuff: data[0].nodebuff, soup: data[0].soup, spleef: data[0].spleef, sumo: data[0].sumo, battlerush: data[0].battlerush, stickfight: data[0].stickfight });
  
      extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[0].name}'`, (err, res2) => {
        if (err) console.log("Error: ", err);
  
        const data = JSON.parse(JSON.stringify(res2));
        stats.push({ sensitivename: data[0].sensitivename });
  
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerStats a WHERE a.bp > b.bp ) AS rank FROM PlayerStats b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ bprank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerStats a WHERE a.shards > b.shards ) AS rank FROM PlayerStats b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ shardsrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerStats a WHERE a.coins > b.coins ) AS rank FROM PlayerStats b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ coinsrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerStats a WHERE a.kills > b.kills ) AS rank FROM PlayerStats b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ killsrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerStats a WHERE a.deaths > b.deaths ) AS rank FROM PlayerStats b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ deathsrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.battlerush > b.battlerush ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ battlerushrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.bedfight > b.bedfight ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ bedfightrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.boxing > b.boxing ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ boxingrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.bridge > b.bridge ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ bridgerank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.builduhc > b.builduhc ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ builduhcrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.classic > b.classic ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ classicrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.combo > b.combo ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ comborank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.fist > b.fist ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ fistrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.gapple > b.gapple ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ gapplerank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.nodebuff > b.nodebuff ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ nodebuffrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.soup > b.soup ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ souprank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.spleef > b.spleef ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ spleefrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.sumo > b.sumo ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ sumorank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.mlgrush > b.mlgrush ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ mlgrushrank: data[0].rank });
        });
        connection.query(`SELECT 1 + (SELECT count( * ) FROM PlayerElo a WHERE a.stickfight > b.stickfight ) AS rank FROM PlayerElo b WHERE name = '${username}' ORDER BY rank LIMIT 1;`, (err, res) => {
          const data = JSON.parse(JSON.stringify(res));
          stats.push({ stickfightrank: data[0].rank });
  
          extraConnection.query(`SELECT embedresponse FROM DiscordData WHERE id = '${message.author.id}'`, async (err, res) => {
            const data = JSON.parse(JSON.stringify(res));
  
            if (data[0].embedresponse == 1) {
              const kdrRaw = stats[0].kills / stats[0].deaths;
              const kdr = parseFloat(kdrRaw).toFixed(2);
              const avgelosum = stats[0].mlgrush + stats[0].boxing + stats[0].bridge + stats[0].builduhc + stats[0].combo + stats[0].fist + stats[0].gapple + stats[0].nodebuff + stats[0].soup + stats[0].spleef + stats[0].sumo;
              const rawavgelo = avgelosum / 14;
              const avgelo = parseFloat(rawavgelo).toFixed(1);
  
              const embed = new Discord.MessageEmbed()
                .setColor("#fcd403")
                .setTitle(`Statistics - ${stats[1].sensitivename}`)
                .setThumbnail(`http://api.zeqa.net/api/players/avatars/${username.replace(" ", "%20")}`)
                .setDescription(`**Rank:** ${stats[0].rank}\n\n**Kills:** ${stats[0].kills} (#${stats[5].killsrank})\n**Deaths:** ${stats[0].deaths} (#${stats[6].deathsrank})\n**K/DR:** ${kdr}\n**Coins:** ${stats[0].coins} (#${stats[4].coinsrank})\n**Shards:** ${stats[0].shards} (#${stats[3].shardsrank})\n**BattlePoints:** ${stats[0].bp} (#${stats[2].bprank})\n\n**BattleRush:** ${stats[0].battlerush} (#${stats[7].battlerushrank})\n**BedFight:** ${stats[0].bedfight} (#${stats[8].bedfightrank})\n**Boxing:** ${stats[0].boxing} (#${stats[9].boxingrank})\n**Bridge:** ${stats[0].bridge} (#${stats[10].bridgerank})\n**BuildUHC:** ${stats[0].builduhc} (#${stats[11].builduhcrank})\n**Classic:** ${stats[0].classic} (#${stats[12].classicrank})\n**Combo:** ${stats[0].combo} (#${stats[13].comborank})\n**Fist:** ${stats[0].fist} (#${stats[14].fistrank})\n**Gapple:** ${stats[0].gapple} (#${stats[15].gapplerank})\n**NoDebuff:** ${stats[0].nodebuff} (#${stats[16].nodebuffrank})\n**MLGRush:** ${stats[0].mlgrush} (#${stats[20].mlgrushrank})\n**Soup:** ${stats[0].soup} (#${stats[17].souprank})\n**Spleef:** ${stats[0].spleef} (#${stats[18].spleefrank})\n**Sumo:** ${stats[0].sumo} (#${stats[19].sumorank})\n**StickFight:** ${stats[0].stickfight} (#${stats[21].stickfightrank})\n**Average Elo:** ${avgelo}\n\n**Play Time:** ${checkPlayTime(secondsToHours(stats[0].totalonline))}\n**Last Seen:** ${moment(stats[0].lastplayed, "YYYY:MM:DD:HH:mm").fromNow()}`)
                .setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL());
  
              msg.edit({ content: " ", embeds: [embed] });
            } else {
              const kdrRaw = stats[0].kills / stats[0].deaths;
              const kdr = parseFloat(kdrRaw).toFixed(2);
              const avgelosum = stats[0].mlgrush + stats[0].stickfight + stats[0].classic + stats[0].bedfight + stats[0].battlerush + stats[0].boxing + stats[0].bridge + stats[0].builduhc + stats[0].combo + stats[0].fist + stats[0].gapple + stats[0].nodebuff + stats[0].soup + stats[0].spleef + stats[0].sumo;
              const rawavgelo = avgelosum / 14;
              const avgelo = parseFloat(rawavgelo).toFixed(1);
                  
              const canvas = Canvas.createCanvas(630, 520);
              const context = canvas.getContext("2d");
                  
              const x = canvas.width / 2;
                  
              Canvas.registerFont("./assets/Bold.otf", { family: "Bold Minecraftia" });
              Canvas.registerFont("./assets/Regular.otf", { family: "Regular Minecraftia" });
                  
              await Canvas.loadImage("./assets/statsbg.png").then((image) => {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
              });
                  
              context.font = "40px \"Bold Minecraftia\"";
              context.fillStyle = "#ffffff";
              context.shadowColor = "black";
              context.shadowBlur = 5;
              context.shadowOffsetX = 3;
              context.shadowOffsetY = 3;
              context.textAlign = "center";
              context.fillText(stats[1].sensitivename, x, 60);
                  
              context.font = "30px \"Bold Minecraftia\"";
              context.textAlign = "center";
              if (stats[0].rank == "Dev" || stats[0].rank == "Owner" || stats[0].rank == "Admin") {
                context.fillStyle = "#FF5555";
              }
                  
              if (stats[0].rank == "Mod") {
                context.fillStyle = "#FFAA00";
              }
                  
              if (stats[0].rank == "HeadMod") {
                context.fillStyle = "#FFAA00";
              }
                  
              if (stats[0].rank == "Designer") {
                context.fillStyle = "#55FF55";
              }
                  
              if (stats[0].rank == "Helper") {
                context.fillStyle = "#FFFF55";
              }
                  
              if (stats[0].rank == "Mvp") {
                context.fillStyle = "#00AAAA";
                context.fillText("MVP", x, 90);
              }
                  
              if (stats[0].rank == "MvpPlus") {
                context.fillStyle = "#5555FF";
                context.fillText("MVP+", x, 90);
              }
                  
              if (stats[0].rank == "Voter") {
                context.fillStyle = "#55FF55";
              }
                  
              if (stats[0].rank == "Builder" || stats[0].rank == "HeadBuilder") {
                context.fillStyle = "#55FFFF";
              }
                  
              if (stats[0].rank == "Booster") {
                context.fillStyle = "#FF55FF";
              }

              if (stats[0].rank == "Vip") {
                context.fillStyle = "#FF55FF";
                context.fillText("VIP", x, 90);
              }
                  
              if (stats[0].rank == "Player") {
                context.fillStyle = "#AAAAAA";
              }
                  
              if (stats[0].rank == "Famous") {
                context.fillStyle = "#AA00AA";
                context.fillText("Media+", x, 90);
              }
              if (stats[0].rank == "Media") {
                context.fillStyle = "#AA00AA";
              }
              if (stats[0].rank !== "MvpPlus" && stats[0].rank !== "Mvp" && stats[0].rank !== "Famous" && stats[0].rank !== "Vip") {
                context.fillText(stats[0].rank, x, 90);
              }
                  
              context.fillStyle = "#ffffff";
              context.font = "15px \"Regular Minecraftia\"";
              context.fillText(`Kills: ${stats[0].kills} (#${stats[5].killsrank})`, 145, 160);
              context.fillText(`Deaths: ${stats[0].deaths} (#${stats[6].deathsrank})`, 145, 180);
              context.fillText(`Coins: ${stats[0].coins} (#${stats[4].coinsrank})`, 145, 200);
              context.fillText(`Shards: ${stats[0].shards} (#${stats[3].shardsrank})`, 145, 220);
              context.fillText(`BattlePoints: ${stats[0].bp} (#${stats[2].bprank})`, 145, 240);
              context.fillText(`Avg. Elo: ${avgelo}`, 145, 260);
              context.fillText(`K/DR: ${kdr}`, 145, 280);
              context.fillText(`BattleRush: ${stats[0].battlerush} (#${stats[7].battlerushrank})`, 498, 160);
              context.fillText(`BedFight: ${stats[0].bedfight} (#${stats[8].bedfightrank})`, 498, 180);
              context.fillText(`Boxing: ${stats[0].boxing} (#${stats[9].boxingrank})`, 498, 200);
              context.fillText(`Bridge: ${stats[0].bridge} (#${stats[10].bridgerank})`, 498, 220);
              context.fillText(`BuildUHC: ${stats[0].builduhc} (#${stats[11].builduhcrank})`, 498, 240);
              context.fillText(`Classic: ${stats[0].classic} (#${stats[12].classicrank})`, 498, 260);
              context.fillText(`Combo: ${stats[0].combo} (#${stats[13].comborank})`, 498, 280);
              context.fillText(`Fist: ${stats[0].fist} (#${stats[14].fistrank})`, 498, 300);
              context.fillText(`Gapple: ${stats[0].gapple} (#${stats[15].gapplerank})`, 498, 320);
              context.fillText(`NoDebuff: ${stats[0].nodebuff} (#${stats[16].nodebuffrank})`, 498, 340);
              context.fillText(`MLGRush: ${stats[0].mlgrush} (#${stats[20].mlgrushrank})`, 498, 360);
              context.fillText(`Soup: ${stats[0].soup} (#${stats[17].souprank})`, 498, 380);
              context.fillText(`Spleef: ${stats[0].spleef} (#${stats[18].spleefrank})`, 498, 400);
              context.fillText(`Sumo: ${stats[0].sumo} (#${stats[19].sumorank})`, 498, 420);
              context.fillText(`StickFight: ${stats[0].stickfight} (#${stats[21].stickfightrank})`, 498, 440);
                  
              await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${username.replace(" ", "%20")}`).then((image) => {
                context.drawImage(image, 38, 427, 50, 50);
              });
                                  
              context.fillStyle = "#ffffff";
              context.shadowColor = "black";
              context.shadowBlur = 5;
              context.shadowOffsetX = 3;
              context.shadowOffsetY = 3;
              context.textAlign = "left";
              context.fillText(`Play Time: ${checkPlayTime(secondsToHours(stats[0].totalonline))}`, 100, 447);
              context.fillText(`Last Seen: ${moment(stats[0].lastplayed, "YYYY:MM:DD:HH:mm").fromNow()}`, 100, 467);
                  
              const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${data.name}.png`);
              msg.edit({ content: " ", files: [attachment] });
            }
          });
        });
      });
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["s", "p", "profile"],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Basic",
  description: "Displays a player's in-game statistics",
  usage: "stats [player]"
};