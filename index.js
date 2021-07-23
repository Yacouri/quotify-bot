const { Client } = require("discord.js");
const runServer = require("./server");
require("dotenv").config();

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "bruv") {
    msg.reply("kekw 🤡");
  }
});

runServer();
client.login(process.env.TOKEN);
