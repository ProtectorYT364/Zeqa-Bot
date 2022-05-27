const { toProperCase } = require("../modules/functions.js");
const { MessageEmbed } = require("discord.js");
const config = require("../config.js");

exports.run = (client, message, args, level) => {
  const { container } = client;
  if (!args[0]) {
    const settings = message.settings;
    const myCommands = message.guild ? container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
      container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
    const enabledCommands = myCommands.filter(cmd => cmd.conf.enabled);
    const commandNames = [...enabledCommands.keys()];
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = "";
    const sorted = enabledCommands.sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);

    sorted.forEach(c => {
      const cat = toProperCase(c.help.category);
      if (currentCategory !== cat) {
        output += `\u200b\n**__${cat}__**\n`;
        currentCategory = cat;
      }
      output += `**${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}** - ${c.help.description}\n`;
    });
    const embed = new MessageEmbed()
      .setTitle(`Commands - use ${settings.prefix}help <command> for more info on a command`)
      .setThumbnail(config.logo)
      .setColor("#ffcd00")
      .setDescription(output)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  } else {
    let command = args[0];
    if (container.commands.has(command) || container.commands.has(container.aliases.get(command))) {
      command = container.commands.get(command) ?? container.commands.get(container.aliases.get(command));
      if (level < container.levelCache[command.conf.permLevel]) return;
      const embed = new MessageEmbed()
        .setTitle(`Command Information - ${command.help.name}`)
        .setColor("#ffcd00")
        .setDescription(`${command.help.description}\n\nUsage: ${command.help.usage}\n\nAliases: ${command.conf.aliases.length > 0 ? command.conf.aliases.join(", ") : "None"}`)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } else return message.reply("That command was not found.");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "Basic",
  description: "Displays all commands you can use",
  usage: "help [command]"
};