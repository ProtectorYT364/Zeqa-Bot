const logger = require("../modules/logger.js");

module.exports = {
  name: "error",
  once: false,
  async execute(error) {
    logger.log(`An error regarding DJS occurred: \n${JSON.stringify(error)}`, "error");
  }
};