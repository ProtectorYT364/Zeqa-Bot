const { MessageEmbed } = require("discord.js");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);

  message.reply("Fetching!").then(async (msg) => {
    const embed = new MessageEmbed()
      .setTitle("<:atlanta_idle:616613445290164224> Bot Statistics")
      .setColor("#ffcd00")
      .setDescription(`**Memory Usage** - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n**Uptime** - ${duration}\n**Bot Latency** - ${msg.createdTimestamp - message.createdTimestamp}ms\n**API Latency** - ${Math.round(message.client.ws.ping)}ms\n**Node version** - ${process.version}`)
      .setTimestamp();

    msg.edit({ content: " ", embeds: [embed] });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Dev"
};

exports.help = {
  name: "botstats",
  category: "System",
  description: "Returns bot statistics",
  usage: "botstats"
};