const axios = require("axios");
const { Client, Intents } = require("discord.js");
const { token } = require("./config.js");

function choose(array) {
  return array[Math.floor(array.length * Math.random())];
}

const POST_TYPES = ["rich:video", "image"];

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "post") {
    await handlePost(interaction);
  }
});

async function handlePost(interaction) {
  const subreddit = interaction.options.getString("subreddit");
  const response = await axios({
    method: "get",
    url: `https://www.reddit.com/r/${subreddit}.json?limit=100`,
    responseType: "json",
  });
  const choices = response.data.data.children
    .map((c) => c.data)
    .filter((d) => POST_TYPES.includes(d.post_hint));
  const choice = choose(choices);
  interaction.reply(choice.url);
}

client.login(token);
