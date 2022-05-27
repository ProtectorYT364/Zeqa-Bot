const Discord = require("discord.js");
const config = require("../config.js");

async function clean(client, text) {
  if (text && text.constructor.name == "Promise")
    text = await text;
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));

  text = text.replaceAll(client.token, "[REDACTED]");

  return text;
}

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(" ");
  const evaled = eval(code);
  const cleaned = await clean(client, evaled);
  const embed = new Discord.MessageEmbed()
    .setTitle("Eval Job")
    .setColor("#ffcd00")
    .setDescription("**Output** -\n```js\n" + cleaned + "\n```")
    .setTimestamp();

  message.reply({ embeds: [embed] });
  client.channels.cache.get(config.channels.botLogsChannel).send(`${message.author.tag} ran the eval command with the following code: \`\`\`js\n${code}\n\`\`\``);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates javascript code & executes it",
  usage: "eval [code]"
};