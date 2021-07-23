const { MessageEmbed } = require("discord.js");

// config axios
const apiUrl = "https://api.quotable.io";
const axios = require("axios").default.create({ baseURL: apiUrl });

// handle api request rejection
const handleRequestRejection = (msg) => {
  process.on("unhandledRejection", () => {
    msg.reply("There was an error!");
    process.exit();
  });
};

// message embed template
const quoteMessageTemplate = (author, title, color, tag, username, avatar) => {
  const authorWikiUrl = `https://en.wikipedia.org/wiki/${author
    .split(" ")
    .join("_")}`;
  const embed = new MessageEmbed()
    .setAuthor(`🧓🏼 ${author}`, null, authorWikiUrl)
    .setDescription(title)
    .setColor(color)
    .setThumbnail(avatar)
    .addFields(
      { name: "Request by", value: username, inline: true },
      { name: "Tag", value: ` #${tag[0]}`, inline: true },
      { name: "Author", value: author, inline: true }
    )
    .setTimestamp();
  return embed;
};

// get random quote
const getRandomQuote = (msg) => {
  const { username } = msg.member.user;
  const avatar = msg.author.displayAvatarURL({ dynamic: true })
  axios.get("/random").then((res) => {
    const { author, content, tags } = res.data;
    msg.reply('`🔎 looking for random quote...`')
    msg.reply(quoteMessageTemplate(author, content, "#2ECC71", tags, username, avatar));
  });
};

// get random with a specific tag
const getFamousQuote = (msg) => {
  const { username } = msg.member.user;
  const avatar = msg.author.displayAvatarURL({ dynamic: true })
  axios.get("/random?tag=famous").then((res) => {
    const { author, content, tags } = res.data;
    msg.reply('`🔎 looking for famous quote...`')
    msg.reply(quoteMessageTemplate(author, content, "#F1C40F", tags, username, avatar));
  });
};

module.exports = { getRandomQuote, getFamousQuote };
