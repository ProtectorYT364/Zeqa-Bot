const Discord = require("discord.js");
const config = require("../config.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;
    if (message.channel.id !== config.channels.bugChannel) return;

    message.delete();
        
    const button = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton().setCustomId("accept_bug_report").setLabel("Accept").setStyle("SUCCESS"),
      new Discord.MessageButton().setCustomId("deny_bug_report").setLabel("Deny").setStyle("DANGER")
    );

    message.channel.send("<:check:883326130986303511> | Thank you! Your bug report has been successfully recorded and been forwarded to the development team.").then(msg => { setTimeout(() => { msg.delete(); }, 10000); });
    client.channels.cache.get(config.channels.bugReviewChannel).send({ embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Bug Report").setColor(0xffcd00).setDescription(`**Submitted by:** <@${message.author.id}> | ${message.author.tag}\n\n**Message:**\n\`\`\`${message.content}\`\`\`\n\n**Status:** -`).setFooter(`${message.author.id} | ${message.attachments.map(attachment => attachment.url)}`)], components: [button] }).then(msg => {
      if (message.attachments.size > 0) {
        msg.reply({ "content": "Evidence:", "files": message.attachments.map(attachment => attachment.url) });
      } else {
        const matches = message.content.match(/\bhttps?:\/\/\S+/gi);
        msg.reply({ "content": `Evidence: ${matches?.toString()}` });
      }
    });
  }
};