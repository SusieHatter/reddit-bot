const { Client, Intents } = require("discord.js");
const { token } = require("./config.js");
const { getPost } = require("./reddit.js");

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
  const post = await getPost(subreddit);
  interaction.reply(post.url);
}

client.login(token);
