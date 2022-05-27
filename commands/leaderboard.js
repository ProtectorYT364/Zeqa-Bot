const Discord = require("discord.js");
const Canvas = require("canvas");
const config = require("../config.js");
const mysql = require("mysql");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
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
    message.reply(`<:cross:883326239341965332> | Usage: ${settings.prefix}leaderboard <gamemode/stats>`);
    return;
  }

  message.reply("Fetching, please wait...").then(async (msg) => {
    const lbName = args[0].toLowerCase();

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
  
    if (args[0].toLowerCase() == "mlgrush" || args[0].toLowerCase() == "classic" || args[0].toLowerCase() == "stickfight" || args[0].toLowerCase() == "battlerush" || args[0].toLowerCase() == "bedfight" || args[0].toLowerCase() == "boxing" || args[0].toLowerCase() == "bridge" || args[0].toLowerCase() == "builduhc" || args[0].toLowerCase() == "combo" || args[0].toLowerCase() == "fist" || args[0].toLowerCase() == "gapple" || args[0].toLowerCase() == "nodebuff" || args[0].toLowerCase() == "soup" || args[0].toLowerCase() == "spleef" || args[0].toLowerCase() == "sumo") {
      connection.connect(function(err) {
        if (err) throw err;
        connection.query(`SELECT name, ${args[0].toLowerCase()} FROM PlayerElo ORDER BY ${args[0].toLowerCase()} DESC LIMIT 10;`, function(err, result) {
          if (err) throw err;
          
          const data = JSON.parse(JSON.stringify(result));
          const eloLb = [];
  
          extraConnection.connect();
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[0].name}'`, (err, res1) => {
            const data = JSON.parse(JSON.stringify(res1));
            eloLb.push({ name: data[0].sensitivename, ranking: 1 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[1].name}'`, (err, res2) => {
            const data = JSON.parse(JSON.stringify(res2));
            eloLb.push({ name: data[0].sensitivename, ranking: 2 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[2].name}'`, (err, res3) => {
            const data = JSON.parse(JSON.stringify(res3));
            eloLb.push({ name: data[0].sensitivename, ranking: 3 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[3].name}'`, (err, res4) => {
            const data = JSON.parse(JSON.stringify(res4));
            eloLb.push({ name: data[0].sensitivename, ranking: 4 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[4].name}'`, (err, res5) => {
            const data = JSON.parse(JSON.stringify(res5));
            eloLb.push({ name: data[0].sensitivename, ranking: 5 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[5].name}'`, (err, res6) => {
            const data = JSON.parse(JSON.stringify(res6));
            eloLb.push({ name: data[0].sensitivename, ranking: 6 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[6].name}'`, (err, res7) => {
            const data = JSON.parse(JSON.stringify(res7));
            eloLb.push({ name: data[0].sensitivename, ranking: 7 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[7].name}'`, (err, res8) => {
            const data = JSON.parse(JSON.stringify(res8));
            eloLb.push({ name: data[0].sensitivename, ranking: 8 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[8].name}'`, (err, res9) => {
            const data = JSON.parse(JSON.stringify(res9));
            eloLb.push({ name: data[0].sensitivename, ranking: 9 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[9].name}'`, (err, res10) => {
            const data = JSON.parse(JSON.stringify(res10));
            eloLb.push({ name: data[0].sensitivename, ranking: 10 });
  
            extraConnection.query(`SELECT embedresponse FROM DiscordData WHERE id = '${message.author.id}'`, async (err, res) => {
              const data = JSON.parse(JSON.stringify(res));
              if (data[0].embedresponse == 1) {
                const embed = new Discord.MessageEmbed()
                  .setColor("#fcd403")
                  .setTitle(`Leaderboard - ${toPascalCase(args[0])}`)
                  .setThumbnail(config.logo)
                  .setDescription(`**1st:** ${eloLb[0].name} 🥇\n**2nd:** ${eloLb[1].name} 🥈\n**3rd:** ${eloLb[2].name} 🥉\n**4th:** ${eloLb[3].name}\n**5th:** ${eloLb[4].name}\n**6th:** ${eloLb[5].name}\n**7th:** ${eloLb[6].name}\n**8th:** ${eloLb[7].name}\n**9th:** ${eloLb[8].name}\n**10th:** ${eloLb[9].name}`)
                  .setTimestamp();
  
                msg.edit({ content: " ", embeds: [embed] });
              } else {
                const canvas = Canvas.createCanvas(630, 320);
                const context = canvas.getContext("2d");
  
                const background = await Canvas.loadImage("./assets/leaderboardbg.png");
                const head1 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[0].name.replace(" ", "%20")}`);
                const head2 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[1].name.replace(" ", "%20")}`);
                const head3 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[2].name.replace(" ", "%20")}`);
                const head4 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[3].name.replace(" ", "%20")}`);
                const head5 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[4].name.replace(" ", "%20")}`);
                const head6 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[5].name.replace(" ", "%20")}`);
                const head7 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[6].name.replace(" ", "%20")}`);
                const head8 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[7].name.replace(" ", "%20")}`);
                const head9 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[8].name.replace(" ", "%20")}`);
                const head10 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[9].name.replace(" ", "%20")}`);
  
                const x = canvas.width / 2;
  
                Canvas.registerFont("./assets/Bold.otf", { family: "Bold Minecraftia" });
                Canvas.registerFont("./assets/Regular.otf", { family: "Regular Minecraftia" });
  
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
  
                context.font = "40px \"Bold Minecraftia\"";
                context.fillStyle = "#FFFFFF";
                context.shadowColor = "black";
                context.shadowBlur = 5;
                context.shadowOffsetX = 3;
                context.shadowOffsetY = 3;
                context.textAlign = "center";
                context.fillText(args[0].toUpperCase(), x, 50);
  
                context.font = "25px \"Bold Minecraftia\"";
                context.fillStyle = "#D4AF37";
                context.fillText("1. ", 92, 132);
  
                context.fillStyle = "#C0C0C0";
                context.fillText("2. ", 92, 172);
  
                context.fillStyle = "#CD7F32";
                context.fillText("3. ", 92, 212);
  
                context.fillStyle = "#ffffff";
                context.fillText("4. ", 92, 252);
                context.fillText("5. ", 92, 292);
                context.fillText("6. ", 372, 132);
                context.fillText("7. ", 372, 172);
                context.fillText("8. ", 372, 212);
                context.fillText("9. ", 372, 252);
                context.fillText("10. ", 362, 292);
  
                context.textAlign = "left";
                context.font = "20px \"Regular Minecraftia\"";
                context.fillStyle = "#D4AF37";
                context.fillText(`${eloLb[0].name}`, 135, 131);
  
                context.fillStyle = "#C0C0C0";
                context.fillText(`${eloLb[1].name}`, 135, 171);
  
                context.fillStyle = "#CD7F32";
                context.fillText(`${eloLb[2].name}`, 135, 211);
  
                context.fillStyle = "#ffffff";
                context.fillText(`${eloLb[3].name}`, 135, 251);
                context.fillText(`${eloLb[4].name}`, 135, 291);
                context.fillText(`${eloLb[5].name}`, 415, 131);
                context.fillText(`${eloLb[6].name}`, 415, 171);
                context.fillText(`${eloLb[7].name}`, 415, 211);
                context.fillText(`${eloLb[8].name}`, 415, 251);
                context.fillText(`${eloLb[9].name}`, 415, 291);
  
                context.drawImage(head1, 107, 112, 20, 20);
                context.drawImage(head2, 107, 152, 20, 20);
                context.drawImage(head3, 107, 192, 20, 20);
                context.drawImage(head4, 107, 232, 20, 20);
                context.drawImage(head5, 107, 272, 20, 20);
                context.drawImage(head6, 387, 112, 20, 20);
                context.drawImage(head7, 387, 152, 20, 20);
                context.drawImage(head8, 387, 192, 20, 20);
                context.drawImage(head9, 387, 232, 20, 20);
                context.drawImage(head10, 387, 272, 20, 20);
  
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${lbName}LB.png`);
                msg.edit({ content: " ", files: [attachment] });
              }
            });
          });
        });
      });
    } else if (args[0].toLowerCase() == "kills" || args[0].toLowerCase() == "deaths" || args[0].toLowerCase() == "coins" || args[0].toLowerCase() == "shards" || args[0].toLowerCase() == "bp") {
      connection.connect(function(err) {
        if (err) throw err;
        connection.query(`SELECT name, ${args[0].toLowerCase()} FROM PlayerStats ORDER BY ${args[0].toLowerCase()} DESC LIMIT 10;`, function(err, result) {
          if (err) throw err;
          const data = JSON.parse(JSON.stringify(result));
          const eloLb = [];
  
          extraConnection.connect();
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[0].name}'`, (err, res1) => {
            const data = JSON.parse(JSON.stringify(res1));
            eloLb.push({ name: data[0].sensitivename, ranking: 1 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[1].name}'`, (err, res2) => {
            const data = JSON.parse(JSON.stringify(res2));
            eloLb.push({ name: data[0].sensitivename, ranking: 2 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[2].name}'`, (err, res3) => {
            const data = JSON.parse(JSON.stringify(res3));
            eloLb.push({ name: data[0].sensitivename, ranking: 3 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[3].name}'`, (err, res4) => {
            const data = JSON.parse(JSON.stringify(res4));
            eloLb.push({ name: data[0].sensitivename, ranking: 4 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[4].name}'`, (err, res5) => {
            const data = JSON.parse(JSON.stringify(res5));
            eloLb.push({ name: data[0].sensitivename, ranking: 5 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[5].name}'`, (err, res6) => {
            const data = JSON.parse(JSON.stringify(res6));
            eloLb.push({ name: data[0].sensitivename, ranking: 6 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[6].name}'`, (err, res7) => {
            const data = JSON.parse(JSON.stringify(res7));
            eloLb.push({ name: data[0].sensitivename, ranking: 7 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[7].name}'`, (err, res8) => {
            const data = JSON.parse(JSON.stringify(res8));
            eloLb.push({ name: data[0].sensitivename, ranking: 8 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[8].name}'`, (err, res9) => {
            const data = JSON.parse(JSON.stringify(res9));
            eloLb.push({ name: data[0].sensitivename, ranking: 9 });
          });
          extraConnection.query(`SELECT sensitivename FROM PlayersData WHERE name = '${data[9].name}'`, (err, res10) => {
            const data = JSON.parse(JSON.stringify(res10));
            eloLb.push({ name: data[0].sensitivename, ranking: 10 });
  
            extraConnection.query(`SELECT embedresponse FROM DiscordData WHERE id = '${message.author.id}'`, async (err, res) => {
              const data = JSON.parse(JSON.stringify(res));
              if (data[0].embedresponse == 1) {
                const embed = new Discord.MessageEmbed()
                  .setColor("#fcd403")
                  .setTitle(`Leaderboard - ${toPascalCase(args[0])}`)
                  .setThumbnail(config.logo)
                  .setDescription(`**1st:** ${eloLb[0].name} 🥇\n**2nd:** ${eloLb[1].name} 🥈\n**3rd:** ${eloLb[2].name} 🥉\n**4th:** ${eloLb[3].name}\n**5th:** ${eloLb[4].name}\n**6th:** ${eloLb[5].name}\n**7th:** ${eloLb[6].name}\n**8th:** ${eloLb[7].name}\n**9th:** ${eloLb[8].name}\n**10th:** ${eloLb[9].name}`)
                  .setTimestamp();
  
                msg.reply({ embeds: [embed] });
              } else {
                const canvas = Canvas.createCanvas(630, 320);
                const context = canvas.getContext("2d");
  
                const background = await Canvas.loadImage("./assets/leaderboardbg.png");
                const head1 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[0].name.replace(" ", "%20")}`);
                const head2 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[1].name.replace(" ", "%20")}`);
                const head3 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[2].name.replace(" ", "%20")}`);
                const head4 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[3].name.replace(" ", "%20")}`);
                const head5 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[4].name.replace(" ", "%20")}`);
                const head6 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[5].name.replace(" ", "%20")}`);
                const head7 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[6].name.replace(" ", "%20")}`);
                const head8 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[7].name.replace(" ", "%20")}`);
                const head9 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[8].name.replace(" ", "%20")}`);
                const head10 = await Canvas.loadImage(`http://api.zeqa.net/api/players/avatars/${eloLb[9].name.replace(" ", "%20")}`);
  
                const x = canvas.width / 2;
  
                Canvas.registerFont("./assets/Bold.otf", { family: "Bold Minecraftia" });
                Canvas.registerFont("./assets/Regular.otf", { family: "Regular Minecraftia" });
  
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
  
                context.font = "40px \"Bold Minecraftia\"";
                context.fillStyle = "#FFFFFF";
                context.shadowColor = "black";
                context.shadowBlur = 5;
                context.shadowOffsetX = 3;
                context.shadowOffsetY = 3;
                context.textAlign = "center";
                context.fillText(args[0].toUpperCase(), x, 50);
  
                context.font = "25px \"Bold Minecraftia\"";
                context.fillStyle = "#D4AF37";
                context.fillText("1. ", 92, 132);
  
                context.fillStyle = "#C0C0C0";
                context.fillText("2. ", 92, 172);
  
                context.fillStyle = "#CD7F32";
                context.fillText("3. ", 92, 212);
  
                context.fillStyle = "#ffffff";
                context.fillText("4. ", 92, 252);
                context.fillText("5. ", 92, 292);
                context.fillText("6. ", 372, 132);
                context.fillText("7. ", 372, 172);
                context.fillText("8. ", 372, 212);
                context.fillText("9. ", 372, 252);
                context.fillText("10. ", 362, 292);
  
                context.textAlign = "left";
                context.font = "20px \"Regular Minecraftia\"";
                context.fillStyle = "#D4AF37";
                context.fillText(`${eloLb[0].name}`, 135, 131);
  
                context.fillStyle = "#C0C0C0";
                context.fillText(`${eloLb[1].name}`, 135, 171);
  
                context.fillStyle = "#CD7F32";
                context.fillText(`${eloLb[2].name}`, 135, 211);
  
                context.fillStyle = "#ffffff";
                context.fillText(`${eloLb[3].name}`, 135, 251);
                context.fillText(`${eloLb[4].name}`, 135, 291);
                context.fillText(`${eloLb[5].name}`, 415, 131);
                context.fillText(`${eloLb[6].name}`, 415, 171);
                context.fillText(`${eloLb[7].name}`, 415, 211);
                context.fillText(`${eloLb[8].name}`, 415, 251);
                context.fillText(`${eloLb[9].name}`, 415, 291);
  
                context.drawImage(head1, 107, 112, 20, 20);
                context.drawImage(head2, 107, 152, 20, 20);
                context.drawImage(head3, 107, 192, 20, 20);
                context.drawImage(head4, 107, 232, 20, 20);
                context.drawImage(head5, 107, 272, 20, 20);
                context.drawImage(head6, 387, 112, 20, 20);
                context.drawImage(head7, 387, 152, 20, 20);
                context.drawImage(head8, 387, 192, 20, 20);
                context.drawImage(head9, 387, 232, 20, 20);
                context.drawImage(head10, 387, 272, 20, 20);
  
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${lbName}LB.png`);
                msg.edit({ content: " ", files: [attachment] });
              }
            });
          });
        });
      });
    } else {
      msg.edit("<:cross:883326239341965332> | That leaderboard was not found.");
      return;
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["lb"],
  permLevel: "User"
};

exports.help = {
  name: "leaderboard",
  category: "Basic",
  description: "Displays leaderboard for ranked gamemode or statistics",
  usage: "leaderboard [gamemode/stats/votes]"
};