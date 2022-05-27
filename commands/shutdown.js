exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  await message.reply("<:check:883326130986303511> | Shutting down...");
  await Promise.all(client.container.commands.map(cmd => {
    delete require.cache[require.resolve(`./${cmd.help.name}.js`)];
    client.container.commands.delete(cmd.help.name);
  }));
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sd"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "shutdown",
  category: "System",
  description: "Shuts down the bot",
  usage: "shutdown"
};
