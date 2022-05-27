const { MessageEmbed } = require("discord.js");
const config = require("../config.js");

//Ping Hippo/Pat if isses with this file
module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (message.author.bot) return;
    if (message.channel.id == config.channels.reportChannel || message.channel.id == config.channels.bugChannel || message.channel.id == config.channels.suggestionsChannel) return;
        
    const ipMessage = ["?", "port", "ip"];
    const disconnectedMessage = ["disconnected"];
    const uaMessage = ["unfair", "advantage"];
    const rankMessage = ["rank"];
    const reportMessage = ["hacking"];
        
    const MIN_REQUIRED_CONFIDENCE = {
      ip: 60,
      ua: 40,
      dc: 50,
      hax: 70
    };
    const confidence = {
      ip: 0,
      dc: 0,
      ua: 0,
      hax: 0
    };

    for (var i = 0; i < ipMessage.length; i++) {
      for (var x = 0; x < message.content.split(" ").length; x++) {
        if (ipMessage[i].toLowerCase() == message.content.split(" ")[x].toLowerCase()) {
          confidence.ip = confidence.ip + Math.floor(100 / ipMessage.length);
        }
      }
    }

    for (var a = 0; a < disconnectedMessage.length; a++) {
      for (var b = 0; b < message.content.split(" ").length; b++) {
        if (disconnectedMessage[a].toLowerCase() == message.content.split(" ")[b].toLowerCase()) {
          if (message.content.toLowerCase().includes(disconnectedMessage[a].toLowerCase())) {
            confidence.dc = confidence.dc + Math.floor(100 / disconnectedMessage.length);
          }
        }
      }
    }
        
    for (var c = 0; c < uaMessage.length; c++) {
      for (var d = 0; d < message.content.split(" ").length; d++) {
        if (uaMessage[c].toLowerCase() == message.content.split(" ")[d].toLowerCase()) {
          if (message.content.toLowerCase().includes(uaMessage[c].toLowerCase())) {
            confidence.ua = confidence.ua + Math.floor(100 / uaMessage.length);
          }
        }
      }
    }

    for (var g = 0; g < reportMessage.length; g++) {
      if (message.content.toLowerCase().includes(reportMessage[g].toLowerCase())) {
        confidence.hax = confidence.hax + Math.floor(100 / reportMessage.length);
      }
    }

    if (message.channel.id == config.channels.boosterChannel) {
      for (var h = 0; h < rankMessage.length; h++) {
        for (var r = 0; r < message.content.split(" ").length; r++) {
          if (rankMessage[h].toLowerCase() == message.content.split(" ")[r].toLowerCase()) {
            const rankEmbed = new MessageEmbed()
              .setTitle("Claim your rank!")
              .setColor("#ffcd00")
              .setDescription("Please check [this message](https://discord.com/channels/874571610126942208/877018377388965929/919934056186138636) to learn how to claim your rank.")
              .setTimestamp();
            message.channel.send({ embeds: [rankEmbed] });
            break;
          }
        }
      }
    }

    const embeds = [];

    confidence.ip = confidence.ip > 95 ? 100 : confidence.ip;
    confidence.ua = confidence.ua > 95 ? 100 : confidence.ua;
    confidence.dc = confidence.dc > 95 ? 100 : confidence.dc;
    confidence.hax = confidence.hax > 95 ? 100 : confidence.hax;

    if (confidence.ip > MIN_REQUIRED_CONFIDENCE.ip) {
      embeds.push(new MessageEmbed()
        .setTitle("IP & Port")
        .setColor("#ffcd00")
        .setDescription("Here's the IP and port you can use to join the Zeqa Network:\n\n**IP** - Zeqa.net\n**Port** - 19132 (Default)\n**Version** - 1.18.2")
        .setFooter(`Confidence: ${confidence.ip}% - React if this was helpful`));
    }
        
    if (confidence.ua > MIN_REQUIRED_CONFIDENCE.ua) {
      embeds.push(new MessageEmbed()
        .setTitle("Getting kicked for \"unfair advantage\"?")
        .setColor("#ffcd00")
        .setDescription("This occurs when you're clicking over the CPS limit (20). If your mouse double clicks, you can use [DCPrevent](https://cdn.discordapp.com/attachments/753424935006896200/826518141416374292/dcPrevent_1_0_0_3.rar) to prevent your mouse from double clicking.")
        .setFooter(`Confidence: ${confidence.ua}% - React if this was helpful`));
    }
        
    if (confidence.dc > MIN_REQUIRED_CONFIDENCE.dc) {
      embeds.push(new MessageEmbed()
        .setTitle("Getting constantly disconnected?")
        .setColor("#ffcd00")
        .setDescription("This occurs when you're trying to join a region too quickly. Try waiting in the hub for 10 or so seconds then joining a region.")
        .setFooter(`Confidence: ${confidence.dc}% - React if this was helpful`));
    }
        
    if (confidence.hax > MIN_REQUIRED_CONFIDENCE.hax) {
      embeds.push(new MessageEmbed()
        .setTitle("Found a player breaking Zeqa's rules?")
        .setColor("#ffcd00")
        .setDescription("Please head over to <#874580203576373288> and follow the pinned message's instructions. A staff member will look at the report as soon as they can.")
        .setFooter(`Confidence: ${confidence.hax}% - React if this was helpful`));
    }
        
    if (embeds.length > 0) {
      await message.channel.send({ content: `<@${message.author.id}>`, embeds: embeds }).then((message) => {
        message.react("<:check:883326130986303511>").then(() => {
          message.react("<:cross:883326239341965332>");
        });
      });
    }
  }
};