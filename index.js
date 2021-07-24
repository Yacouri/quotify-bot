require("dotenv").config();
const runServer = require("./server");
const { Client } = require("discord.js");
const {
  getRandomQuote,
  getFamousQuote,
  getQuoteWithTag,
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
  if (command === "q") {
    if (!args.length) {
      return channel.send(`You didn't provide any arguments, ${msg.author}!`);
    } else if (args[0] === "random") {
      return getRandomQuote(msg);
    } else if (args[0] === "famous") {
      return getFamousQuote(msg);
    } else if (args[0]) {
      return getQuoteWithTag(msg, args[0]);
    }
  }
});

runServer();
client.login(process.env.TOKEN);
