const { getSettings, permlevel } = require("../modules/functions.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    const { container } = client;

    const settings = message.settings = getSettings(message.guild);

    const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
    if (message.content.match(prefixMention)) {
      return message.reply(`My prefix is \`${settings.prefix}\` :slight_smile:`);
    }

    if (!message.content.startsWith(settings.prefix)) return;
    
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.channel.id == "874578247680147466" || message.channel.id == "955656331891728434" || message.channel.id == "949694589453893722" || message.channel.id == "874578842239520818" || message.channel.id == "887466836659171338" || message.channel.id == "884748533226410035" || message.channel.id == "874580767626395648" || message.channel.id == "874579499692466207" || message.channel.id == "874580203576373288" || message.channel.id == "882572092611112970" || message.channel.id == "966594284696514630" || message.channel.id == "967709254955966474" || message.channel.id == "967611150529343498") return;

    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    const level = permlevel(message);
    const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));

    if (!cmd) return;

    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("<:cross:883326239341965332> | Please run this command in the offical Zeqa server instead - https://discord.gg/zeqa");

    if (!cmd.conf.enabled) return;

    if (level < container.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === "true") {
        return message.channel.send(`<:cross:883326239341965332> | You do not have permission to use this command.\n\nRequired permission level: \`${container.levelCache[cmd.conf.permLevel]}\``);
      } else {
        return;
      }
    }

    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    try {
      await cmd.run(client, message, args, level);
    } catch (e) {
      console.error(e);
      message.channel.send({ content: `An error occurred while processing your request - please ping a developer if the issue continues.\n\n\`\`\`${e.message}\`\`\`` })
        .catch(e => console.error("An error occurred:", e));
    }
  }
};