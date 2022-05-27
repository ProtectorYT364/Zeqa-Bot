const config = require("../config.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  function checkRoles() {
    if (message.member?.roles.cache.has("874576276453740545") || message.member?.roles.cache.has("875994272560713800")) {
      return true;
    } else {
      return false;
    }
  }

  if (message.author.bot) return; 
  if (!checkRoles()) return;

  let announcement;
  let roles;

  message.channel.send("Please type out the announcement below:").then(function(message) {
    const filter = m => m.author.id === message.author.id;
    const collector1 = message.channel.createMessageCollector(filter, { max: 1, time: 15000, errors: ["time"] });

    collector1.on("collect", m => {
      announcement = m.content.replace("<nl>", "\n").replace("<np>", "\n\n");
      collector1.stop();

      message.channel.send("Okay, please name all the roles you'd like to ping below (seperate with commas):").then(function(message) {
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000, errors: ["time"] });
        
        collector.on("collect", m => {
          roles = m.content.split(",");
          collector.stop();
        
          const announcementChannel = client.channels.cache.get("874584752676544523");
          let finalAnnouncement = `**Anouncement**:\n\n${announcement}\n\n**Mentions**: `;
                
          for (let i = 0; i < roles.length; i++) {
            if (roles[i] !== "none") {
              const role = message.guild.roles.cache.find(role => role.name === roles[i]);
              finalAnnouncement += `<@&${role?.id}> `;
            } else {
              finalAnnouncement += "NONE ";
            }
          }
                
          announcementChannel.send(finalAnnouncement);
          message.channel.send("<:check:883326130986303511> | Successfully sent announcement!");
          client.channels.cache.get(config.channels.botLogsChannel).send(`${message.author.tag} made a staff announcement:\n\n\`\`\`${finalAnnouncement}\`\`\``);
                
          collector.on("end", collect => {
            if (collect.size === 0) {
              return message.reply("<:cross:883326239341965332> | Command cancelled, time limit exceeded.");
            }
          });
        });
      });
    });

    collector1.on("end", collect => {
      if (collect.size === 0) {
        return message.reply("<:cross:883326239341965332> | Command cancelled, time limit exceeded.");
      }
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sa"],
  permLevel: "Staff"
};

exports.help = {
  name: "staffannounce",
  category: "Administrative",
  description: "Annouces something in the staff announcements channel.",
  usage: "staffannounce"
};