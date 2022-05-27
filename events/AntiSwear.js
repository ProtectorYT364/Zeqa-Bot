const config = require("../config.js");
const Discord = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    function checkStaffRole() {
      if (message.member?.roles.cache.has(config.roles.staffRole) || message.member?.roles.cache.has(config.roles.staffPlusRole)) {
        return true;
      } else {
        return false;
      }
    }

    if (message.author.bot) return;
    if (message.channel.id == config.channels.reportChannel || message.channel.id == config.channels.bugReviewChannel || message.channel.id == config.channels.suggestionsChannel) return;
    if (checkStaffRole() === true) return;

    if (message.content.includes("discord.gg") && message.content !== "discord.gg/zeqa") {
      message.delete();
      message.channel.send(`<:cross:883326239341965332> | ${message.author}, please do not advertise other servers.`);
    }

    const blockedWords = ["nig","nigger","niggeer","niggger","niggerrr","negro","nigga","ngga","nggga","kys","kill yourself","retard", "faggot","fagot","feg","fgt","faag","faggott","fagot","fatass","gangbang","genital","genitalia", "kkk","ku kux","molest","nazi","rape","raip","rapist","rappe","rapee","raape","rapisst","chigga","ching","chong"];
        
    for (let i = 0; i < blockedWords.length; i++) {
      for (let x = 0; x < message.content.split(" ").length; x++) {
        if (blockedWords[i].toLowerCase() == message.content.split(" ")[x].toLowerCase()) {
          message.delete();
          client.channels.cache.get(config.channels.messageLogsChannel).send({ embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New deleted message").setColor("#ffcd00").setDescription(`From: ${message.author.tag}\nChannel: <#${message.channel.id}>\nReason: Anti-Swear\nMessage: ${message.content}`).setTimestamp()] });
          break;
        }
      }
    }
  }
};