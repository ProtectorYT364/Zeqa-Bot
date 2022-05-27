const config = require("../config.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (message.author.bot && !message.webhookId) return;
    if (message.channel.id == config.channels.rankSyncChannel || message.channel.type == "DM") {

      const args = message.content.split(" {SPLIT} ");
      const discordAccount = client.guilds.cache.get(config.Guild).members.cache.find(m => m.user.tag == args[1]?.toString());
            
      discordAccount?.send(`Hello, ${discordAccount}!\n**${args[0].toString()}** has requested to associate your Discord account with their Zeqa account.\n\nPlease react with ✅ if you would like to continue and ❎ if you wouldn't like to do so.\n\n**Please respond within 5 minutes else the verification process will be automatically aborted.**`).then(botMessage => {
        botMessage.react("✅");
        botMessage.react("❎");

        const filter = (reaction, user) => {
          return (
            ["✅", "❎"].includes(reaction.emoji.name) && user.tag === discordAccount.user.tag
          );
        };

        botMessage.awaitReactions({ filter, max: 1, time: 300000, errors: ["time"] }).then(async collected => {
          if (collected.first().emoji.name === "✅") {
            const roles = args.slice(2).toString().split(" ");
                        
            roles.forEach(function(roleName) {
              if (args[2].toString() == "Mvp" || args[2].toString() == "MvpPlus" || args[2].toString() == "Famous" || args[2].toString() == "Media") {
                if (args[2].toString() == "MvpPlus" || args[2].toString() == "Mvp") {
                  if (args[2].toString() == "Mvp") {
                    discordAccount.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.name == "MVP"));
                  } else {
                    discordAccount.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.name == "MVP+"));
                  }
                } else {
                  discordAccount.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.name == roleName));
                }
              }
            });

            discordAccount.setNickname(`${args[0].toString()}`);
            discordAccount.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.name == "Player"));
            message.guild.channels.cache.get(config.channels.botLogsChannel).send(`${discordAccount} has verified their account. Their username is ${args[0].toString()}.`);
            botMessage.reply(`✅ | Successfully linked **${discordAccount.user.tag}** with **${args[0].toString()}**!`);
          } else botMessage.reply("❎ | Verification process cancelled.");
        }).catch(() => { botMessage.reply("❎ | Time limit exceeded, process cancelled."); });
      }).catch(() => client.channels.cache.get(config.channels.welcomeChannel).send(`Hello, ${discordAccount}!\nYour DMs are currently closed; therefore, the bot cannot continue with the verification process. Please open your DMs & use the in-game command again!`).then(msg => { setTimeout(() => { msg.delete().catch(() => {}); }, 20000); }));
    }
  }
};