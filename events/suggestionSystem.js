const Discord = require("discord.js");
const config = require("../config.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (message.author.bot) return;
    if (message.channel.id !== config.channels.suggestionsChannel || message.channel.isThread() == true) return;

    message.delete();
    message.channel.send("<:check:883326130986303511> | Thank you! Your suggestion has been successfully recorded and forwarded to the development team.").then(msg => { setTimeout(() => { msg.delete(); }, 10000); });
        
    const button = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton().setCustomId("accept_suggestion").setLabel("Accept").setStyle("SUCCESS"),
      new Discord.MessageButton().setCustomId("deny_suggestion").setLabel("Deny").setStyle("DANGER")
    );
    message.guild.channels.cache.get(config.channels.suggestionsReviewChannel).send({ embeds: [new Discord.MessageEmbed().setColor(0xffcd00).setTitle("<:atlanta_folder:601019084468912129> New Suggestion").setDescription(`**Suggested by ${message.author.tag}**\n\n**Content:**\n${message.content}\n\n**Status:** -`).setFooter(message.author.id)], components: [button] });
  }
};