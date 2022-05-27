const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.content.includes("“")) {
    message.reply("You're using iOS quotes, please use normal quotes. You may copy paste this instead:");
    message.channel.send("`\"`");
    return;
  }

  const username = message.content.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  const ticketName = message.content.replace(username, "").trim().split(/ +/g);

  if (message.author.tag === username) return;

  const user = client.users.cache.find(user => user.tag == username);
  const ticket = client.channels.cache.find(channel => channel.name === ticketName[2]);

  ticket?.permissionOverwrites.create(user?.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false, ATTACH_FILES: false, READ_MESSAGE_HISTORY: false }).catch(() => {
    message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Error!").setColor("#ff3333").setDescription("That ticket/username could not be found. Perhaps you made a typo?").setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });    });

  message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Success!").setColor("#4BB543").setDescription(`Successfully removed **${username}** from **${ticketName[2]}**!`).setFooter(`Command requested by ${message.author.tag}`, message.author.displayAvatarURL())] });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ru"],
  permLevel: "Staff"
};

exports.help = {
  name: "removeuser",
  category: "Staff",
  description: "Removes a user from a ticket",
  usage: "removeuser [discord tag] [ticket name]"
};