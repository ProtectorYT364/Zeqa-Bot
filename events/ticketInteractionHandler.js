/* eslint no-undef: 0 */
const Discord = require("discord.js");
const config = require("../config.js");
const fs = require("fs");
const mysql = require("mysql");
const { createTranscript } = require("discord-html-transcripts");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    function roughScale(x, base) {
      const parsed = parseInt(x, base);

      if (isNaN(parsed)) { return 0; }
      return parsed;
    }

    const button = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton().setCustomId("close_ticket").setLabel("Close Ticket").setStyle("DANGER")
    );
    const claim = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton().setCustomId("claim_ticket").setLabel("Claim").setStyle("SUCCESS")
    );
    const claimed = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton().setCustomId("claim_ticket").setLabel("Claim").setStyle("SUCCESS").setDisabled(true)
    );

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

    if (interaction.isSelectMenu()) {
      if (interaction.values[0] === "support") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`support-${(no).pad(4)}`, {
            parent: "959791793111728188",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** support-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__SUPPORT__**").setDescription("Please describe your issue/query here, a staff member will be with you shortly.").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "smp") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`smp-${(no).pad(4)}`, {
            parent: "966646740977610802",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** smp-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__SUPPORT__**").setDescription("Please describe your issue/query here, a staff member will be with you shortly.").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "appeal") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`appeal-${(no).pad(4)}`, {
            parent: "959791391876202526",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** appeal-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__PUNISHMENT APPEAL__**").setDescription("You may make an appeal / apology here. Please remain patient until a staff member reviews your appeal, If you think you were innocent please provide us with some evidence of you proving so.").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "builder") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`builder-${(no).pad(4)}`, {
            parent: "959800428378325102",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: "909424871451271198"
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: "878534647888359445"
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__BUILDER APPLICATION__**").setDescription("Please be patient, a head builder will be with you shortly.").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "famous") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`famous-${(no).pad(4)}`, {
            parent: "959791313954406480",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** famous-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__MEDIA+ RANK APPLICATION__**").setDescription("Please send us your zeqa-exclusive video and please be patient while a staff member checks your application, please make sure you meet the following requirements:\n\n• 1,500 subscribers\n• 1000 views in your last 5 videos\n• A video on Zeqa every 5 months\n• Must not have hacking related content").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "media") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);
            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`media-${(no).pad(4)}`, {
            parent: "959791313954406480",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** media-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__MEDIA RANK APPLICATION__**").setDescription("Please send us your zeqa-exclusive video and please be patient while a staff member checks your application, please make sure you meet the following requirements:\n\n• 800 subscribers\n• 300 views in your last 5 videos\n• A video on Zeqa every 3 months\n• Must not have hacking related content").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "giveaway") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`giveaway-${(no).pad(4)}`, {
            parent: "959791556099964928",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** giveaway-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__CLAIM GIVEAWAY PRIZE__**").setDescription("Please send us your username, a staff member will review your ticket soon.").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "store") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`store-${(no).pad(4)}`, {
            parent: "959791722018254878",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** store-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__CLAIM STORE ITEM__**").setDescription("Please send us your username along with what item you need assistance with, a staff member will review your ticket soon.").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.values[0] === "giveawayrole") {
        if (interaction.member?.roles.cache.has("874576915078459402")) {
          interaction.member?.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.id == "946356247127552050"));
          await interaction.reply({ content: "<:check:883326130986303511> | Successfully added the giveaway ping role to your account!", ephemeral: true });
        } else {
          await interaction.reply({ content: "<:cross:883326239341965332> | You need to verify your account first! Please check <#889095776192573502>.", ephemeral: true });
        }
      }

      if (interaction.values[0] === "sneakpeekrole") {
        if (interaction.member?.roles.cache.has("874576915078459402")) {
          interaction.member?.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.id == "946502587983745065"));
          await interaction.reply({ content: "<:check:883326130986303511> | Successfully added the sneak peek ping role to your account!", ephemeral: true });
        } else {
          await interaction.reply({ content: "<:cross:883326239341965332> | You need to verify your account first! Please check <#889095776192573502>.", ephemeral: true });
        }
      }

      if (interaction.values[0] === "changelogsrole") {
        if (interaction.member?.roles.cache.has("874576915078459402")) {
          interaction.member?.roles.add(client.guilds.cache.get(config.Guild).roles.cache.find(role => role.id == "948224256880295966"));
          await interaction.reply({ content: "<:check:883326130986303511> | Successfully added the changelogs ping role to your account!", ephemeral: true });
        } else {
          await interaction.reply({ content: "<:cross:883326239341965332> | You need to verify your account first! Please check <#889095776192573502>.", ephemeral: true });
        }
      }

      if (interaction.values[0] === "partnership") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("ticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("ticketno.txt", `Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`partnership-${(no).pad(4)}`, {
            parent: "959791452483911720",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.adminRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.devRole
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            interaction.message.edit({ embeds: [embed], components: [row] });
            client.channels.cache.get(config.channels.ticketClaimChannel).send({ content: `<#${channel.id}>`, embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor(0xffcd00).setDescription(`**Opened by:** ${interaction.user.tag}\n**Ticket:** partnership-${(no).pad(4)}\n**Status:** ❌ Unclaimed`).setFooter(channel.id).setTimestamp()], components: [claim] });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor("#fec900").setTitle("**__APPLY FOR PARTNERSHIP__**").setDescription("Please send us your event detail, type of the event, plan for the event, estimate number of attender, and other related information.").setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === "staffticket") {
        if ((Date.now() - (ticketOpenCooldown[interaction.user.id] ? ticketOpenCooldown[interaction.user.id] : 0)) <= 10 * 60 * 1000) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You need to wait 10 minutes until you can open another ticket!")], ephemeral: true });
        ticketOpenCooldown[interaction.user.id] = Date.now();

        fs.readFile("staffticketno.txt", function(err, data) {
          if (err) return console.error(err);

          const x = data.toString().split(" ").slice(-1).toString();
          const no = parseInt(x) + 1;

          Number.prototype.pad = function(size) {
            let s = String(this);

            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
          };

          fs.writeFile("staffticketno.txt", `Staff Ticket Number: ${(no)}`, function(err) { if (err) console.log(err); });

          interaction.guild.channels.create(`staff-${(no).pad(4)}`, {
            parent: "959800573350256660",
            type: "text",
            permissionOverwrites: [{
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: interaction.user.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"],
              id: "878534647888359445"
            },
            {
              deny: "VIEW_CHANNEL",
              id: interaction.guild.id
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: config.roles.staffPlusRole
            },
            {
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              id: "878534647888359445"
            }
            ]
          }).then(channel => {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setColor(0x00ff00).setDescription(`\`✅\` Ticket <#${channel.id}> has been opened`)], ephemeral: true });
            channel.send({ content: `<@${interaction.user.id}>` }).then(sent => sent.delete());
            channel.send({ embeds: [new Discord.MessageEmbed().setColor(0x1ec45b).setTitle("Staff Ticket").setDescription(`Welcome, ${interaction.user.tag}! A senior staff member will be with you shortly.`).setFooter(`Ticket opened by ${interaction.user.tag} | ${interaction.user.id}`).setTimestamp()], components: [button] });
          });
        });
      }

      if (interaction.customId === "close_ticket") {
        if (!interaction.channel.name.startsWith("staff")) {
          const attachment = await createTranscript(interaction.channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${roughScale(interaction.channel.name.split("").slice(-4).toString().replace(/,/g, ""), 10)}.html`,
          });

          const embed = new Discord.MessageEmbed()
            .setColor("#fcd403")
            .setTitle("Ticket Transcript")
            .setThumbnail(config.logo)
            .addFields(
              { name: "Ticket Name", value: interaction.channel.name },
              { name: "Closed By", value: interaction.user.tag },
              { name: "Closed At", value: interaction.createdAt.toLocaleString() }
            );

          interaction.guild.channels.cache.get(config.channels.ticketArchiveChannel).send({
            embeds: [embed],
            files: [attachment]
          });
        }

        interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("#fcd403").setDescription("You have pressed the `[Close Ticket]` button, the ticket will be deleted & archived after 10 seconds!")] });
        setTimeout(() => { interaction?.channel?.delete(); }, 10000);
      }

      if (interaction.customId === "claim_ticket") {
        interaction.update({ embeds: [new Discord.MessageEmbed().setTitle("<:atlanta_folder:601019084468912129> New Ticket").setColor("#fcd403").setDescription(interaction.message.embeds[0].description.replace(interaction.message.embeds[0].description.split("\n").slice(-1).toString(), `**Status:** ✅ Claimed by ${interaction.user.tag}`)).setFooter(interaction.message.embeds[0].footer.text).setTimestamp()], components: [claimed] });

        const connection = mysql.createConnection({
          host: config.mysqlCredentials.host,
          user: config.mysqlCredentials.user,
          password: config.mysqlCredentials.password,
          database: config.mysqlCredentials.database
        });

        const Guild = client.guilds.cache.get("874571610126942208");
        const member = Guild.members.cache.get(interaction.user.id);

        connection.connect();
        connection.query(`UPDATE StaffStats SET tickets = tickets + 1 WHERE name = '${member.displayName}';`, function(err) {
          if (err) throw err;
        });

        const ticketChnl = interaction.guild.channels.cache.find(c => c.id === interaction.message.embeds[0].footer.text);
        ticketChnl?.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });
      }
    }
  }
};