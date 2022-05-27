const config = require("../config.js");
const Discord = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const ticketChannel = await client.guilds.cache.get(config.Guild).channels.fetch(config.channels.ticketChannel);
    const collection = await ticketChannel.messages.fetch();
    const ticketStaffChannel = await client.guilds.cache.get(config.Guild).channels.fetch(config.channels.ticketStaffChannel);
    const staffCollection = await ticketStaffChannel.messages.fetch();
    const roleChannel = await client.guilds.cache.get(config.Guild).channels.fetch(config.channels.roleChannel);
    const roleCollection = await roleChannel.messages.fetch();

    //Normal Ticket Message
    if (collection.size === 0) {
      const row = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
        .setCustomId("ticketselection")
        .setPlaceholder("Select an option (1-9)")
        .setMaxValues(1)
        .addOptions([{
          label: "Support",
          description: "Get assistance from our staff members.",
          value: "support",
          emoji: "1️⃣"
        },
        {
          label: "Appeal",
          description: "Appeal your ban/mute.",
          value: "appeal",
          emoji: "2️⃣"
        },
        {
          label: "Media+ Rank",
          description: "Apply for the Media+ rank.",
          value: "famous",
          emoji: "3️⃣"
        },
        {
          label: "Media Rank",
          description: "Apply for the Media rank.",
          value: "media",
          emoji: "4️⃣"
        },
        {
          label: "Giveaway Prize",
          description: "Claim the item you won from a giveaway.",
          value: "giveaway",
          emoji: "5️⃣"
        },
        {
          label: "Store",
          description: "Claim an item you purchased.",
          value: "store",
          emoji: "6️⃣"
        },
        {
          label: "Partnership",
          description: "Apply for Zeqa partnership.",
          value: "partnership",
          emoji: "7️⃣"
        },
        {
          label: "Builder Application",
          description: "Apply for the Builder position.",
          value: "builder",
          emoji: "8️⃣"
        },
        {
          label: "SMP",
          description: "Get assistance regarding the Zeqa SMP.",
          value: "smp",
          emoji: "9️⃣"
        }
        ])
      );

      const embed = new Discord.MessageEmbed()
        .setTitle("Create Ticket")
        .setColor("#fec900")
        .setThumbnail(config.logo)
        .setDescription("Need assistance with a specific issue you have? A question you don't know the answer of? Want to get a apply for the famous or media rank? Appeal a punishment you believe has been unfairly been given or simply want to apologize for your wrongdoing? Press the selection menu, select the option you want, follow the instructions that'll be shown & a staff member will soon contact you!\n\n**Content creator rank requirements**:\n\n**MEDIA+ RANK**\n- 🔔 **1,500** Subscribers\n- 👁️ **1000** Views in last **5** videos\n- 🎥 **30** Average live viewers (Twitch only)\n\n**MEDIA RANK**\n- 🔔 **800** Subscribers\n- 👁️ **300** Views in last **5** videos\n- 🎥 **20** Average live viewers (Twitch only)\n\n**Information regarding Zeqa's content creator ranks**:\n- Must feature Zeqa once every 3 months (5 months for Media+)\n- Content about Zeqa, with IP and port shown in the description\n- No hacking related content\n- Good reputation in the community (not just in Zeqa)\n- We **DO NOT** accept TikTokers at the moment, since TikTok's algorithm is not consistent\n\n*This information might be updated without notice, so please check this channel frequently if you're interested in these ranks!*");

      ticketChannel.send({
        embeds: [embed],
        components: [row]
      });
    }

    //Staff Ticket Message        

    if (staffCollection.size === 0) {
      const button = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("staffticket").setLabel("Open Ticket").setStyle("PRIMARY").setEmoji("📧"));

      ticketStaffChannel.send({
        embeds: [new Discord.MessageEmbed().setColor(0x87291F).setAuthor("Staff Ticket", config.logo)
          .setDescription("Create a ticket to discuss private matters with senior staff members.")
        ],
        components: [button]
      });
    }

    //Role Selection Message
    if (roleCollection.size === 0) {
      const row = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
        .setCustomId("ticketselection")
        .setPlaceholder("Select an option")
        .setMaxValues(3)
        .addOptions([{
          label: "Giveaway Ping",
          description: "This role will be pinged when we host giveaways.",
          value: "giveawayrole",
          emoji: "🎉"
        },
        {
          label: "Sneak Peek Ping",
          description: "This role will be pinged when we post sneak peeks.",
          value: "sneakpeekrole",
          emoji: "👀"
        },
        {
          label: "Changelogs Ping",
          description: "This role will be pinged when we post changelogs.",
          value: "changelogsrole",
          emoji: "📜"
        }
        ])
      );

      const embed = new Discord.MessageEmbed()
        .setTitle("Zeqa - Role Selection")
        .setColor("#fec900")
        .setThumbnail(config.logo)
        .setDescription("Select the roles you would like to be notified for within this Discord server. You can select the following roles:\n\n🎉 **Giveaway Ping**\n👀 **Sneak Peek Ping**\n📜 **Changelogs Ping**");

      roleChannel.send({
        embeds: [embed],
        components: [row]
      });
    }
  }
};