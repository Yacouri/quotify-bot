require("dotenv").config();
const runServer = require("./server");
const { Client } = require("discord.js");
const {getRandomQuote, getFamousQuote} = require('./bot_commands/commands')

const client = new Client();

client.on("ready", () => {
  console.log("[+] Bot is running...");
});

client.on("message", (msg) => {
  const { content }  = msg
  if (msg.author.bot) return;
  if (content === "$q random"){
    getRandomQuote(msg)
  }
  if (content === "$q famous"){
    getFamousQuote(msg)
  }
});

runServer();
client.login(process.env.TOKEN);
