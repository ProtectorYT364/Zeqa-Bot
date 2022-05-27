const logger = require("../modules/logger.js");
const request = require("request");

module.exports = {
  name: "ready",
  once: false,
  async execute(client) {
    logger.log(`${client.user.tag} is online!`, "ready");

    request.get({
      url: "https://api.mcsrvstat.us/bedrock/2/zeqa.net:19132",
      json: true,
      headers: { "User-Agent": "request" }
    }, (err, res, data) => {
      if (err) {
        console.log("Error:", err);
      } else if (res.statusCode !== 200) {
        console.log("Status:", res.statusCode);
      } else {
        if (data.online === true) {
          const playersOnline = data.players.online;

          const status = `${playersOnline} players online on Zeqa`;

          setInterval(async () => {
            client.user.setActivity(status, { type: "WATCHING" });
          }, 15000);
        } else {
          const playersOnline = 0;
          const status = `${playersOnline} players online on Zeqa`;

          setInterval(async () => {
            client.user.setActivity(status, { type: "WATCHING" });
          }, 15000);
        }
      }
    });
  }
};