/* eslint no-undef: 0 */
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Update to node 16.x+");
require("dotenv").config();

const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { intents, partials, permLevels } = require("./config.js");
const logger = require("./modules/logger.js");
const client = new Client({ intents, partials });

const commands = new Collection();
const aliases = new Collection();

const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

client.container = {
  commands,
  aliases,
  levelCache
};

const init = async () => {
  const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
  for (const file of commands) {
    const props = require(`./commands/${file}`);
    logger.log(`Loading command: ${props.help.name}...`, "log");
    client.container.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.container.aliases.set(alias, props.help.name);
    });
  }

  const eventFiles = readdirSync("./events").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
      logger.log(`Loading event: ${file}...`, "log");
    }
  }

  ticketOpenCooldown = [];

  client.on("threadCreate", (thread) => thread.join());

  client.login();
};

init();