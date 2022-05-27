const config = require("../config.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const { container } = client;
  if (!args || args.length < 1) return message.reply("Please provide a command name to reload!");
  const command = container.commands.get(args[0]) || container.commands.get(container.aliases.get(args[0]));

  if (!command) {
    return message.reply("That command was not found, run z?help to see all commands.");
  }
  delete require.cache[require.resolve(`./${command.help.name}.js`)];
  container.commands.delete(command.help.name);
  const props = require(`./${command.help.name}.js`);
  container.commands.set(command.help.name, props);

  message.reply(`\`z?${command.help.name}\` has been reloaded.`);
  client.channels.cache.get(config.channels.botLogsChannel).send(`${message.author.tag} reloaded command: ${command.help.name}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Dev"
};

exports.help = {
  name: "reload",
  category: "System",
  description: "Reloads a command without restarting the entire bot",
  usage: "reload [command]"
};