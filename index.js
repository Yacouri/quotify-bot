require("dotenv").config();
const runServer = require("./server");
const { Client } = require("discord.js");
const {
  getRandomQuote,
  getFamousQuote,
  getQuoteWithTag,
  errorMessageEmbed,
  getAllTags,
  getHelp,
} = require("./bot_commands/commands");

const client = new Client();

client.on("ready", () => {
  console.log("[+] Bot is running...");
});

client.on("message", (msg) => {
  const { content, channel } = msg;
  const args = content.slice(1).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (msg.author.bot) return;
  // $q: quotes prefix
  if (command === "q") {
    if (!args.length) {
      return errorMessageEmbed(
        `You didn't provide any arguments, ${msg.author}!`,
        channel
      );
    } else if (args[0] === "random") {
      return getRandomQuote(msg);
    } else if (args[0] === "famous") {
      return getFamousQuote(msg);
    } else if (args[0]) {
      return getQuoteWithTag(msg, args[0]);
    }
    // $t: tags prefix
  } else if (command === "t") {
    if (!args.length) {
      return errorMessageEmbed(
        `You didn't provide any arguments, ${msg.author}!`,
        channel
      );
    } else if (args[0] === "tags") {
      return getAllTags(msg);
    }
  }
  // $h: help prefix
  else if (command === "h") {
      return getHelp(msg);
  }
});

runServer();
client.login(process.env.TOKEN);
