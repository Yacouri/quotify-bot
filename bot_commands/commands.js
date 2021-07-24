const { MessageEmbed } = require("discord.js");

/* ************************** */
/* *** API CONFIGURATION **** */
/* ************************** */

const apiUrl = "https://api.quotable.io";
const axios = require("axios").default.create({ baseURL: apiUrl });

/* ************************ */
/* **** EMBED MESSAGES **** */
/* ************************ */

// error message embed
const errorMessageEmbed = (error, channel) => {
  const embed = new MessageEmbed().setColor("#E74C3C").setDescription(error);
  channel.send(embed);
};

// quote message embed
const quoteMessageEmbed = (author, title, color, tag, username, avatar) => {
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
      { name: "Tag", value: ` #${[tag]}`, inline: true },
      { name: "Author", value: author, inline: true }
    )
    .setTimestamp();
  return embed;
};

// tags message embed
const tagMessageEmbed = (tags, channel) => {
  let fieldValue = "";
  tags.forEach((tag) => {
    fieldValue += `${tag} \n`;
  });
  const embed = new MessageEmbed()
    .setColor("#1ABC9C")
    .setTitle("Quotify's all tags")
    .addFields({ name: "Tags:", value: fieldValue });
  channel.send(embed);
};

// help message embed
const helpMessageEmbed = (channel) => {
  const quotify_logo = "https://scontent.frba2-1.fna.fbcdn.net/v/t1.15752-9/221931282_248895087070447_1141499124717104116_n.png?_nc_cat=105&ccb=1-3&_nc_sid=ae9488&_nc_eui2=AeG_hVSwMkd07XnMQ55AziKX683waR-McOnrzfBpH4xw6SqBu9JqLI7_1HeE915Iu0FhdhPizdbpV8h9LWVnaR_v&_nc_ohc=LyCxVDxq3O0AX_mC1Is&_nc_ht=scontent.frba2-1.fna&oh=b73a5fd19f0b70dfd21d3090e3437fc9&oe=6121A4AC"
  const embed = new MessageEmbed()
    .setAuthor("Quotify bot.")
    .setURL("https://github.com/yacouri")
    .setColor("#3498DB")
    .setTitle("Quotify bot help documentation.")
    .addField("$h", "Returns documentation.")
    .addField("$t tags", "Returns all available tags.")
    .addFields(
      { name: "$q random", value: "Returns random quote.", inline: true },
      { name: "$q famous", value: "Returns famous quote.", inline: true },
      {
        name: "$q [tag]",
        value: "Returns a quote with specific tag. ex: `$q life`",
        inline: true,
      }
    )
    .setImage(quotify_logo)
    .setFooter("Made with 💖 by Zouhir YACOURI");
  channel.send(embed);
};

/* ********************* */
/* *** API REQUESTS **** */
/* ********************* */

// get random quote
const getRandomQuote = (msg) => {
  const { username } = msg.member.user;
  const avatar = msg.author.displayAvatarURL({ dynamic: true });
  axios.get("/random").then((res) => {
    const { author, content, tags } = res.data;
    msg.reply("`🔎 looking for random quote...`");
    msg.reply(
      quoteMessageEmbed(author, content, "#2ECC71", tags, username, avatar)
    );
  });
};

// get random famous quote
const getFamousQuote = (msg) => {
  const { username } = msg.member.user;
  const avatar = msg.author.displayAvatarURL({ dynamic: true });
  axios
    .get("/random?tags=famous")
    .then((res) => {
      const { author, content, tags } = res.data;
      msg.reply("`🔎 looking for famous quote...`");
      msg.reply(
        quoteMessageEmbed(author, content, "#F1C40F", tags, username, avatar)
      );
    })
    .catch(() =>
      errorMessageEmbed(
        `${msg.author} please make sure the command is correct. Type \`$h help \` to see the the documentation`,
        msg.channel
      )
    );
};

// get random quote with a specific tag
const getQuoteWithTag = (msg, tag) => {
  const tags_array = [];
  const { username } = msg.member.user;
  const avatar = msg.author.displayAvatarURL({ dynamic: true });
  axios
    .get("/tags")
    .then((res) => {
      res.data.forEach((element) => {
        tags_array.push(element.name);
      });
    })
    .then(() => {
      if (tags_array.includes(tag)) {
        axios.get(`/random?tags=${tag}`).then((res) => {
          const { author, content, tags } = res.data;
          msg.reply(`🔎 looking for quote with *${tag}* tag...`);
          msg.reply(
            quoteMessageEmbed(
              author,
              content,
              "#1ABC9C",
              tags,
              username,
              avatar
            )
          );
        });
      } else {
        errorMessageEmbed(
          `\`${tag}\` not found, please type \`$t tags\` to see all tags.`,
          msg.channel
        );
      }
    });
};

// get all tags
const getAllTags = (msg) => {
  const tags_array = [];
  axios
    .get("/tags")
    .then((res) => {
      res.data.forEach((element) => {
        tags_array.push(element.name);
      });
    })
    .then(() => {
      tagMessageEmbed(tags_array, msg.channel);
    });
};

// get help (documentation)
const getHelp = (msg) => {
  helpMessageEmbed(msg.channel);
};

module.exports = {
  getRandomQuote,
  getFamousQuote,
  getQuoteWithTag,
  getAllTags,
  getHelp,
  errorMessageEmbed,
};
